const Discord = require("discord.js")

module.exports = function(message, type, status, user, data) {
	let response
	let embed = new Discord.MessageEmbed()
	let image
	
	switch (status) {
		case "positive":
			embed.setColor("78FF6E")
			embed.setTitle("Success!")
			break;
		case "negative":
			embed.setColor("FF342E")
			embed.setTitle("Failure!")
			break;
		case "neutral":
			embed.setColor("80827F")
			break;
		default:
			embed.setColor("80827F")
			embed.setTitle("Unknown")
	}
	
	// set "requested by" footer
	if (user) {
		embed.setFooter("Requested by "+user.username,user.avatarURL({ format: "png", size: 256 }))
	}
	
	switch (type) {
		case "reply":
			embed.setTitle(data.title)
			if (data.description) embed.setDescription(data.description)
			break;
		case "urlimage":
			embed.setTitle(data.title)
			embed.setImage(data.url)
			if (data.description) embed.setDescription(data.description)
			break;
		case "image":
			image = { attachment: data.image, name: "embedattachment.png" }
			embed.setTitle(data.title)
			embed.setImage("attachment:\//embedattachment.png")
			if (data.description) embed.setDescription(data.description)
			break;
		case "error":
			embed.setTitle("An error occured!")
			embed.setDescription(data.description)
			if (data.error) {
				embed.addField("Error message", "```"+data.error+"```")
			}
			break;
	}
	
	response = { embeds: [embed.toJSON()] }
	
	if (image) {
		response.files = [image]
	}
	return response
}