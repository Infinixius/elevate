import { angry, footer } from "../../src/modules/reply.js"
import { error } from "../../src/modules/logger.js"
import fetch from "node-fetch"

export default {
	"name": "rather",
	"description": "Gets a random \"Would you rather?\" question from https://either.io/.",
	
	"usage": "rather",
	"cooldown": 5,
	execute: async function(interaction) {
		await interaction.deferReply()
		fetch("http://either.io/questions/next")
		.then(res => res.json())
		.then(json => {
			var question = json.questions[0]
			if (question) {
				interaction.editReply({embeds: [{
					"title": question.title,
					"description": `Would you rather **${question.option_1}** or **${question.option_2}**?\n\n||**${question.option1_total}** people would rather choose option 1, while **${question.option2_total}** would rather choose option 2.||`,
					"footer": footer(interaction),
					"color": 0x35a1db
				}]})
					.then(message => {
						message.react("🇦")
						message.react("🇧")
					})
			} else {
				interaction.editReply(angry("Failed to fetch from https://either.io"))
			}
		})
		.catch(err => {
			interaction.editReply(angry("Failed to fetch from https://either.io"))
			error("Failed to fetch from https://either.io! Error: " + err)
		})
	}
}