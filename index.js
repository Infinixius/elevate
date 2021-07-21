const Discord = require("discord.js")
var startTime = new Date()
const client = new Discord.Client({
	partials: ["MESSAGE", "CHANNEL", "GUILD", "USER"],
	intents: [
		Discord.Intents.FLAGS.DIRECT_MESSAGES,
		Discord.Intents.FLAGS.GUILDS,
		Discord.Intents.FLAGS.GUILD_MESSAGES
	]
})
const config = require("./config.json")
const fs = require("fs")
const splash = require("./assets/splash.json")
var stats = require("./stats.json")
global.stats = stats

// utility modules
const events = require("./modules/Events.js")
const logger = require("./modules/Logger.js")

client.cooldowns = new Discord.Collection()

// initialize commands
client.commands = new Discord.Collection()
const commandFolders = fs.readdirSync("./commands")

for (const folder of commandFolders) {
	if (!config.modules[folder]) continue
	const commandFiles = fs.readdirSync("./commands/"+folder).filter(file => file.endsWith(".js"))
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`)
		client.commands.set(command.name, command)
	}
}

// events
client.on("ready", () => {events.ready(client)})
client.on("message", (msg) => {events.message(msg)})

// initialize
stats.timesLaunched++
console.log(splash.splash)
client.login(config.token)

setInterval(function(){
	stats.timeElapsed = stats.timeElapsed + 5
	fs.writeFile("./stats.json", JSON.stringify(stats), function(err) {
		if (err) throw err
	})
}, 5000)