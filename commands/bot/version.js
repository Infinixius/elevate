module.exports = {
	name: "version",
	description: "Returns the current version, and the latest version if applicable.",
	aliases: ["changelog"],
	category: "bot",
	async execute(message, args, context) {
		const update = require("../../modules/Updates.js")()
		let embed = { color: "37D5FF", fields: [], title: "Version "+update.current }
		
		if (update.checkenabled) {
			embed.fields.push({ name: "Patch notes for "+update.latest, value: update.body })
			embed.fields.push({ name: "Changelog/Download", value: update.url })
		}
		embed.footer = {
			"text": `Requested by ${message.author.username}`,
			"icon_url": message.author.avatarURL({ format: "png", size: 256 })
		}
		
		if (update.outdated) {
			embed.description = "This version is outdated! The latest version available is "+update.latest+"."
		} else {
			embed.description = "This is the latest version."
		}
		
		message.reply({ embeds: [embed] })
	},
};