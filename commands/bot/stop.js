module.exports = {
	name: "stop",
	description: "Stops the bot.",
	aliases: ["kill"],
	category: "bot",
	permissions: ["botowner"],
	async execute(message, args, context) {
		await message.react("👍")
		await message.client.destroy()
		process.exit()
	},
};