const response = require("../../modules/Response.js")

module.exports = {
	name: "help",
	description: "Shows a generic help message, or retrieves information about a command.",
	category: "bot",
	usage: "[command]",
	async execute(message, args, context) {
		if (args[0]) {
			const { commands } = message.client
			const name = args[0].toLowerCase()
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))
			
			if (!command) {
				message.reply(response(message, "reply", "negative", message.author, { title: "That isn't a command!" }))
			}
			
			let msg = "**Name**: "+command.name+"\n"
			if (command.aliases) msg = msg + "**Aliases**: "+command.aliases.join(', ')+"\n"
			if (command.category) {msg = msg + "**Category**: "+command.category+"\n"}
			if (command.description) msg = msg + "**Description**: "+command.description+"\n"
			if (command.usage) msg = msg = "**Usage**: "+command.usage+"\n"
			msg = msg + `**Cooldown**: ${command.cooldown || 3} second(s)\n`
			if (command.nsfw) msg = msg + "This command only works in NSFW channels"
			
			message.reply(response(message, "reply", "positive", message.author, { title: "Command info for "+command.name, description: msg }))
			return
		}
		let stats = global.stats.stats
		message.reply({
		  "embeds": [
		    {
		      "title": "Elevate",
		      "description": "Elevate is a multipurpose Discord bot written by infinixius#5875.",
		      "color": 5397979,
		      "fields": [
		        {
		          "name": "Commands",
		          "value": "https://infinixius.github.io/elevate/Commands\n\nAlternatively, you can run `help` with a command to see more information about that command, or `cmds` to get a list of all commands."
		        },
		        {
		          "name": "Statistics",
		          "value": `So far, ${stats.messages} messages have been sent, ${stats.commands} commands have been processed, and the bot has been up for a total of ${Math.round(stats.timeElapsed/60)} minutes.`
		        },
		        {
		          "name": "Links",
		          "value": "[Commands](https://infinixius.github.io/elevate/Commands) - [Credits](https://infinixius.github.io/elevate/Credits) - [GitHub](https://github.com/infinixius/elevate)",
		          "inline": true
		        }
		      ],
		      "footer": {
		        "text": `Requested by ${message.author.username} | Built with <3 by infinixius`,
				"icon_url": message.author.avatarURL({ format: "png", size: 256 })
		      }
		    }
		  ]
		})
	},
};