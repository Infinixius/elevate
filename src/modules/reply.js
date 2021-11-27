import config from "../../config.json"

const HAPPY_COLOR = 0x5af969
const NEUTRAL_COLOR = 0x35a1db
const ANGRY_COLOR = 0xe73232

export function footer(interaction) { // footer creator
	return {
		"text": `Requested by ${interaction.user.username}#${interaction.user.discriminator}`,
		"icon_url": interaction.user.avatarURL()
	}
}

export function happy(message, interaction) { // returns a happy embed reply
	return {
		"content": null,
		"embeds": [
			{
				"title": message,
				"color": HAPPY_COLOR,
				"footer": footer(interaction)
			}
		]
	}
}

export function neutral(message, interaction) { // returns a neutral embed reply
	return {
		"content": null,
		"embeds": [
			{
				"title": message,
				"color": NEUTRAL_COLOR,
				"footer": footer(interaction)
			}
		]
	}
}

export function angry(message, interaction) { // returns an angry embed reply
	return {
		"content": null,
		"embeds": [
			{
				"title": message,
				"color": ANGRY_COLOR,
				"footer": footer(interaction)
			},
		]
	}
}