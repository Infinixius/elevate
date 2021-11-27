// this file has to be a commonjs module because es2016 import statements don't work on line 19 for some reason
// and as such, all exports and imports are commonjs
const fs = require("fs")
const config = require("../../config.json")
const { REST } = require("@discordjs/rest")
const { Routes } = require("discord-api-types/v9")
var log, error
import("./logger.js").then(module => {
	log = module.log
	error = module.error
}) // can't use require() or else ERR_REQUIRE_ESM is thrown

var angry
import("./reply.js").then(module => {
	angry = module.angry
}) // can't use require() or else ERR_REQUIRE_ESM is thrown

const rest = new REST({ version: "9" }).setToken(config.token)
const commands = []
const slashCommands = [] // "commands" but only with the name and description parameters, this is used for sending the commands to discord

const rawCommands = []
const commandFolders = fs.readdirSync("./commands")
for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync("./commands/"+folder).filter(file => file.endsWith(".js"))

	for (const file of commandFiles) {
		if (file == "baseCommand.js") continue
		rawCommands.push(`../../commands/${folder}/${file}`)
	}
}

var loaded = 0
for (const rawCommand of rawCommands) {
	import(rawCommand).then(module => {
		loaded++
		const command = module.default

		commands.push(command)
		slashCommands.push({
			name: command.name,
			description: command.description,
			options: command.options ?? undefined
		})

		if (loaded >= rawCommands.length) {
			console.log()
			try {
				if (config.dev == true) {
					for (guildID of config.guilds) {
						rest.put(
							Routes.applicationGuildCommands(config.applicationID, guildID),
							{ body: slashCommands }
						)
					}
				} else {
					rest.put(
						Routes.applicationCommands(config.applicationID),
						{ body: slashCommands }
					)
				}
				console.log(`Loaded ${loaded} commands`)
			} catch (err) {
				console.error(err)
			}
		}
	}) // can't use require() or else ERR_REQUIRE_ESM is thrown
}

module.exports.getList = function() {
	var list = []
	for (command of commands) {
			list.push(command.name)
	}
	list.sort((a, b) => { // alphabetical sort, should port this to keylimepie later
		var fa = a.toLowerCase()
		var fb = b.toLowerCase()
	
		if (fa < fb) return -1
		if (fa > fb) return 1
		
		return 0
	})
	return list
}

module.exports.getCommand = function(command) {
	var foundCommand = commands.find(cmd => cmd.name == command)
	if (foundCommand) {
		return foundCommand
	}
}

var checkPermissions, checkCooldown
import("./commands.permissions.js").then(module => {
	checkPermissions = module.default
}) // can't use require() or else ERR_REQUIRE_ESM is thrown

import("./commands.cooldowns.js").then(module => {
	checkCooldown = module.default
}) // can't use require() or else ERR_REQUIRE_ESM is thrown

module.exports.runCommand = async function(interaction) {// ran in index.js to run a slash command
	if (!interaction.isCommand()) return
	log(`${interaction.user.username}#${interaction.user.discriminator} (${interaction.user.id}) invoked command /${interaction.commandName} in guild "${interaction.guild.name}"`)

	const command = commands.find(cmd => cmd.name == interaction.commandName)
		|| commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
	if (!command) return

	if (command.guildOnly && !interaction.inGuild())  return await interaction.reply(angry("This command does not work in DMs!", interaction))

	if (!checkPermissions(command.permissions, interaction.member)) return await interaction.reply(angry("You don't have permission to use that command!", interaction))

	if (command.nsfw && !interaction.channel.nsfw && interaction.inGuild()) {
		return await interaction.reply(angry("This command only works in NSFW channels or DMs!", interaction))
	}

	var cooldown = checkCooldown(interaction, command)
	if (cooldown) {
		return interaction.reply(angry(`You can't use that for \`${cooldown}\` more seconds.`, interaction))
			.then(() => {
				setTimeout(function(){
					interaction.fetchReply()
						.then(reply => interaction.editReply(angry(`~~${reply.embeds[0].title}~~`, interaction)))
				}, cooldown*1000) // edit the message once the cooldown is up
			})
	}

	try {
		command.execute(interaction)
	} catch (err) {
		error(`Failed to execute command "${command.name}"! Error: "${err}"`)
		await interaction.reply("Failed to execute that command!")
	}
}