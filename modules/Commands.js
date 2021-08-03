const Discord = require("discord.js")
const config = require("../config.json")
const response = require("./Response.js")

module.exports.validate = function(message, command, args) {
	if (command.args && !args.length) {
		message.reply(response(message, "reply", "negative", message.author, { title: `You didn't provide any arguments! Intended usage: \`${command.usage}\`` }))
		return true
	}
	if (command.guildOnly && message.channel.type == "dm") {
		message.reply(response(message, "reply", "negative", message.author, { title: "This command only works in servers, not DMs!" }))
		return true
	}
	if (command.nsfw && !message.channel.nsfw && !config.allowNSFWAnywhere) {
		message.reply(response(message, "reply", "negative", message.author, { title: "This command can only be ran in NSFW channels!" }))
		return true
	}
	return false
}

module.exports.permissionCheck = function(member, permissions, channel) {
	let allowed = false
	for (const permission of permissions) {
		// wouldve used switch here but checking permissions works better with if else
		if (permission == "botowner") {
			if (config.globalPermissions.botowner.includes(member.id.toString())) { allowed = true }
		} else if (permission == "serverowner") {
			if (member.id == channel.guild.ownerID) { allowed = true }
		} else if (Discord.Permissions.FLAGS[permission]) {
			let perms = member.permissionsIn(channel)
			if (perms.has(permission, config.allowAdministratorOverride)) { allowed = true }
		} else if (permission == "nobody") {
			allowed = false
		}
	}
	return allowed
}

module.exports.cooldownCheck = function(message, command) {
	let cooldowns = message.client.cooldowns
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}
	
	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000;
	
	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return timeLeft
		}
	}
	
	timestamps.set(message.author.id, now)
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount)
}

module.exports.getTarget = function(message, args) {
	let mention = message.mentions.users.first(1)
	
	if (mention) {
		return mention[0]
	} else {
		return message.author
	}
}