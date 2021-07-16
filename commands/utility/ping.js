const response = require("../../modules/Response.js")

module.exports = {
	name: "ping",
	description: "Returns the current API ping of the bot.",
	aliases: ["pong"],
	category: "utility",
	execute(message, args, context) {
		var desc = "**Message latency**: " + (Date.now() - message.createdTimestamp) + "ms\n"
		desc = desc + "**Websocket latency**: " + message.client.ws.ping + "ms\n"
		message.reply("Pinging...").then(sent => {
			desc = desc + "**Roundtrip latency**: " + (sent.createdTimestamp - message.createdTimestamp) + "ms"
			sent.edit(response(message, "reply", "positive", message.author, { 
				title: "Pong!",
				description: desc
			}))
		})
	},
};