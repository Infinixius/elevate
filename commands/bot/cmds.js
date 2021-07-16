module.exports = {
	name: "cmds",
	description: "Lists all commands.",
	aliases: ["commands", "cmdlist"],
	category: "bot",
	async execute(message, args, context) {
		let { commands } = message.client
		message.reply({
			"embeds": [
				{
					"title": "Commands list",
					"description": "Use `help` along with a command name to get information on that command. \n```"+commands.map(command => command.name).join(', ')+"```",
					"color": 5397979,
					"footer": {
				        "text": `Requested by ${message.author.username} | Built with <3 by infinixius`,
						"icon_url": message.author.avatarURL({ format: "png", size: 256 })
					}
				}
			]
		})
	},
};