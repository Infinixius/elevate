import Discord from "discord.js"
import fs from "fs"
import * as voice from "@discordjs/voice"
import ytdl from "ytdl-core"
import { happy, angry, footer } from "../../src/modules/reply.js"
import { log, error } from "../../src/modules/logger.js"

export default {
	"name": "playmusic",
	"description": "Plays a song in a voice channel.",
	
	"usage": "playmusic (YouTube URL)",
	"cooldown": 5,
	"options": [{
		name: "url",
		description: "YouTube video URL",
		required: true,
		type: Discord.Constants.ApplicationCommandOptionTypes.STRING
	}],

	execute: async function(interaction) {
		await interaction.deferReply()
		if (!interaction.member.voice.channelId) {
			return interaction.editReply(angry("You must be in a voice channel!", interaction))
		}

		var player = voice.createAudioPlayer()
		player.on("error", err => {
			error(`Error in audio player in guild "${interaction.guild.name}": "${err.message}" with resource "${err.resource.metadata.title}"`);
		})
		player.on("stateChange", (oldState, newState) => {
			if (!oldState.status == newState.status) return // ignore useless "changed from ready to ready" messages
			log(`Audio player in guild "${interaction.guild.name}" transitioned from "${oldState.status}" to "${newState.status}"`)

			if (newState.status == "playing") {
				console.log(resource.playbackDuration)
				console.log(resource.encoder)
				return interaction.editReply(`Now playing ${video.videoDetails.video_url}! Requested by <@${interaction.user.id}>`)
			} else if (newState.status == "idle") {
				connection.destroy()
			}
		})

		await interaction.editReply("Joining voice channel...")
		var connection = await voice.joinVoiceChannel({
			channelId: interaction.member.voice.channelId,
			guildId: interaction.guild.id,
			adapterCreator: interaction.guild.voiceAdapterCreator
		})

		await interaction.editReply("Fetching YouTube video...")
		var video = await ytdl.getInfo(interaction.options.getString("url"))
			.catch(err => {
				error("Failed to fetch ytdl info! Error: " + err)
				return interaction.editReply(angry("Failed to find that video!", interaction))
			})
		if (!video) return
		log(`User "${interaction.user.username}#${interaction.user.discriminator}" (${interaction.user.id}) requesting to play YouTube video "${interaction.options.getString("url")}"`)
		
		await interaction.editReply("Creating audio resource...")
		var resource = voice.createAudioResource(`C:\\Users\\Infinixius\\Development\\Projects\\elevate\\lights.webm`, {
			metadata: {
				title: video.videoDetails.title,
				requestedBy: interaction.user.tag
			}
		})

		await interaction.editReply("Attempting to play...")
		player.play(resource)
		
		connection.on("stateChange", (oldState, newState) => {
			if (!oldState.status == newState.status) return // ignore useless "changed from ready to ready" messages
			log(`Connection state in guild "${interaction.guild.name}" changed from "${oldState.status}" to "${newState.status}"`)
		})
		
		await connection.subscribe(player)
		await interaction.editReply("Waiting for audio player... (this might take a second, be patient)")
	}
}

