module.exports = {
	name: "poll",
	description: "Sets up a simple reaction poll.",
	aliases: ["question"],
	category: "utility",
	async execute(message, args, context) {
		await message.react("👍")
		await message.react("👎")
		await message.react("🤷")
	},
};