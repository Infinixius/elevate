/*
	this script resets all global slash commands (not any guild-specific ones)
	incase of a duplicate or such.

	use it with `npm run resetCommands` or `node --experimental-json-modules src/resetCommands.js`.
	by default uses the token in config.json, but you can change the TOKEN variable below to alter it.
*/

import config from "../../config.json"
const TOKEN = config.token

/* begin */

console.log(`Using token starting with "${TOKEN.slice(0,8)}"!`)

import { Client, Intents } from "discord.js"
const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

client.on("ready", () => {
	console.log(`Logged in as "${client.user.tag}"!`)

	client.application.commands.set([])
		.then(async () => {
			console.log("Successfully deleted all slash commands!")
			await client.user.setPresence({ status: "invisible" })
			await client.destroy()
			process.exit()
		})
		.catch(console.error)
})

client.login(TOKEN)