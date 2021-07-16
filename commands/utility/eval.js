const response = require("../../modules/Response.js")
const config = require("../../config.json")

module.exports = {
	name: "eval",
	description: "Evaluates JavaScript code and returns the result",
	aliases: ["evalute", "exec", "execute", "code"],
	category: "utility",
	args: true,
	usage: "(javascript code)",
	permissions: ["botowner"],
	async execute(message, args, context) {
		// fullArgs is defined here because regular args doesnt include the command itself
		const fullArgs = message.content.trim().split(/ +/)
		var code = message.content.slice(fullArgs[0].length)
			.replace("```js","")
			.replace("```","")
		var failure = false
		var result
		
		try {
			result = await eval(code)
		} catch (error) {
			result = error
			failure = true
		}
		
		if (!result) { result = "No result" } else {
			result = result.toString()
		}
		if (failure) {
			message.reply(response(message, "error", "negative", message.author, { 
				description: "An error occured while evaluating that.",
				error: result
			}))
		} else {
			message.reply(response(message, "reply", "positive", message.author, { 
				title: "Success!",
				description: result
			}))
		}
	}
};