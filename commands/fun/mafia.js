const roles = require("../../assets/mafia_roles.json")
const response = require("../../modules/Response.js")
let rolesArray = []

for (const role of roles) {
	rolesArray.push(role.name)
}
module.exports = {
	name: "mafia",
	description: "Gets a mafia role from a predefined list, or get a list of all roles",
	aliases: ["mafiarole", "mafia-role"],
	category: "fun",
	usage: "[role name]",
	async execute(message, args, context) {
		if (!args[0]) {
			return message.reply(response(message, "reply", "positive", message.author, { 
				title: "List of all roles",
				description: rolesArray.join(", ")
			}))
		}
		
		const role = roles.find(item => item.name.toLowerCase() == args[0])
		if (!role) {
			message.reply(response(message, "reply", "negative", message.author, { 
				title: "That role wasn't found!"
			}))
		} else {
			let alignment = role.alignment
			let color
			if (alignment == 0) {
				alignment = "Sided with the village. Kill all mafia and third-party roles to win!"
				color = "00B9FF"
			} else if (alignment == 1) {
				alignment = "Sided with the mafia. Kill and outnumber all villagers to win!"
				color = "FF463F"
			} else if (alignment == 2) {
				alignment = "Sided with the third party."
				color = "FFC628"
			} else {
				alignment = "Unknown alignment."
			}
			let desc = role.desc
			desc.push("`"+alignment+"`")
			desc = desc.join("\n")
			message.reply({embeds: [{
				title: role.name,
				author: { name: role.pack + " Pack" },
				color: color,
				thumbnail: { url: role.image },
				description: desc
			}]}) //jeez this looks ugly
		}
	},
};