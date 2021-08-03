// Quick script I wrote to automatically generate docs/Commands.md

const fs = require("fs")
var wiki = "# Commands\n\nList of commands.\n\n"

const commandFolders = fs.readdirSync("./commands")

for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync("./commands/"+folder).filter(file => file.endsWith(".js"))
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`)
		wiki = wiki + "### "+command.name+"\n"
		wiki = wiki + command.description+"\n\n"
		wiki = wiki + "Category: "+command.category+"\n\n"
		if (command.aliases) wiki = wiki + "Aliases: "+command.aliases.join(", ")+"\n\n"
		if (command.nsfw) wiki = wiki + "Only works in NSFW channels\n\n"
		if (command.args) wiki = wiki + "Requires arguments. Usage: `"+command.usage+"`\n\n"
		if (command.cooldown) {
			wiki = wiki + "Cooldown: "+command.cooldown
		} else {
			wiki = wiki + "Cooldown: 3"
		}
		wiki = wiki + "\n\n"
	}
}

fs.writeFile("./docs/Commands.md", wiki, function(err) {
	if (err) throw err
})