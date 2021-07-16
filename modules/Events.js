const config = require("../config.json")
const logger = require("./Logger.js")
const commands = require("./Commands.js")
const response = require("./Response.js")
const fs = require("fs")

module.exports.ready = function(client) {
	logger.log("Connected to Discord", "info")
	setInterval(function(){
		var status = config.status.list[Math.floor(Math.random()*config.status.list.length)]
		if (status.startsWith("Watching")){
			client.user.setActivity(config.status.prefix+status.slice(9)+config.status.suffix, { type: "WATCHING" })
		} else if (status.startsWith("Listening to")){
			client.user.setActivity(config.status.prefix+status.slice(13)+config.status.suffix, { type: "LISTENING" })
		} else {
			client.user.setActivity(config.status.prefix+status+config.status.suffix)
		}
	}, 120000)
}
module.exports.message = async function(message) {
	global.stats.stats.messages++
	if (!message.author.id == 485443784180760578) return message.reply("you are not infix")
	let context = {}
	if (message.partial) {logger.log("Partial message: "+message, "debug")} // log partial messages
	if (!message.content.startsWith(config.prefix) || message.author.bot) return
	const args = message.content.slice(config.prefix.length).trim().split(/ +/)
	const commandName = args.shift().toLowerCase()
	
	// get command
	if (!message.client.commands.has(commandName)) return
	const command = message.client.commands.get(commandName)
		|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))
	if (!command) return
	
	// validate command
	let validate = commands.validate(message, command, args)
	if (validate) return
	let cooldown = commands.cooldownCheck(message,command)
	if (cooldown) {
		return message.reply(`You can't use \`${commandName}\` for \`${cooldown}\` more seconds.`)
	}
	
	// check for permissions
	if (command.permissions && !commands.permissionCheck(message.author, command.permissions, message.channel)) {
		return message.reply(response(message, "reply", "negative", null, { title: "You don't have permission to use that!" }))
	}
	
	// return target of the command if required
	if (command.target) {
		let target = commands.getTarget(message, args)
		if (target) {
			context.target = target
		} else {
			return message.reply("You need to provide a target! Example: @"+message.author.username)
		}
	}

	try {
		global.stats.stats.commands++
		command.execute(message, args, context)
	} catch (err) {
		logger.log(`Command error while handling "${message.content}": ${err}`, "error")
		message.reply("Failed to run command!")
	}
	
}