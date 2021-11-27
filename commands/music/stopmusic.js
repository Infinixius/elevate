import Discord from "discord.js"
import * as voice from "@discordjs/voice"
import { happy, angry, footer } from "../../src/modules/reply.js"
import { log, error } from "../../src/modules/logger.js"

export default {
	"name": "stopmusic",
	"description": "Stops a song playing in a voice channel.",
	
	"usage": "stopmusic",

	execute: async function(interaction) {
		await interaction.deferReply()
		if (!interaction.member.voice.channelId) {
			return interaction.editReply(angry("You must be in a voice channel!", interaction))
		}

		const connection = await voice.getVoiceConnection(interaction.member.voice.guild.id)
		if (!connection) {
			return interaction.editReply(angry("Failed to find voice connection!", interaction))
		}
		connection.destroy()
		return interaction.editReply(happy("Successfully stopped playing.", interaction))
	}
}