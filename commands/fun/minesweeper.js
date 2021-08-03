const Minesweeper = require("discord.js-minesweeper")

module.exports = {
	name: "minesweeper",
	description: "Play a game of Minesweeper, optionally with a difficulty of easy/normal/hard.",
	aliases: ["ms"],
	category: "fun",
	usage: "[difficulty of easy, normal, or hard]",
	cooldown: 5,
	async execute(message, args, context) {
		var minesweeper
		switch (args[0]) {
			case "easy":
				minesweeper = new Minesweeper({
					rows: 6,
					columns: 6,
					mines: 7,
					revealFirstCell: true,
					zeroFirstCell: true,
					returnType: "emoji"
				})
				break;
			case "hard":
				minesweeper = new Minesweeper({
					rows: 12,
					columns: 12,
					mines: 20,
					returnType: "emoji"
				})
				break;
			default:
				minesweeper = new Minesweeper()
		}
		message.reply(minesweeper.start())
	},
};