import Discord from "discord.js"
import { happy, angry } from "../../src/modules/reply.js"

export default {
	"name": "eval",
	"description": "Evaluates JavaScript code.",
	
	"usage": "eval (code)",
	"permissions": ["ROOT"],
	"options": [{
		name: "code",
		description: "JavaScript code to be evaulated.",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: async function(interaction) {
		var code = interaction.options.data[0].value
			.replace(/```js/g, "")
			.replace(/```/g, "")
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

		if (!failure) return interaction.reply(happy("Successfully evaluated! Result: ```" + result + "```", interaction))
		interaction.reply(angry("An error occured while evaluating that! Error: ```" + result + "```", interaction))
	}
}