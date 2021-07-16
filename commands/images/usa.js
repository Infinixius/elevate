const images = require("../../modules/Images.js")
const response = require("../../modules/Response.js")

module.exports = {
	name: "usa",
	description: "Overlays a US flag over someone's avatar",
	aliases: ["patriot", "usaflag", "usflag", "patriotify"],
	category: "images",
	cooldown: 5,
	args: true,
	target: true,
	usage: "(mention) [transparency]",
	async execute(message, args, context) {
		let transparency = 0.5
		if (args[1]) { transparency = args[1] }
		await message.react("👀")
		let image = await images.overlay(context.target.avatarURL({ format: "png", size: 1024 }), "./assets/images/usflag.png", transparency)
		let res = response(message.author, "image", "positive", message.author, {image: image, title: context.target.username+" patriotified!"})
		message.reply(res)
	},
};