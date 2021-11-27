import * as lime from "./modules/keylimepie.js"
import { Client, Intents } from "discord.js"
import config from "../config.json"
import { log, error } from "./modules/logger.js"
import commands from "./modules/commands.cjs"
import * as http from "./modules/http.js"
import initStatus from "./modules/status.js"
const { runCommand } = commands // commands.cjs is a commonjs module, and has to be imported this way

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] })

client.on("ready", () => {
	log(`Logged in as ${client.user.tag}!`)
	console.log("-----------------------")

	initStatus(client) // initalize status
})

client.on("interactionCreate", async interaction => {runCommand(interaction)}) // run command

client.login(config.token)