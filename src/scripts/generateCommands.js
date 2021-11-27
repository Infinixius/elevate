/*
	script that generates docs/Commands.md
	run with npm run generateCommands or node src/generateCommands
*/

import fs from "fs"

const folders = fs.readdirSync("./commands")
const wikiFile = fs.createWriteStream("./docs/Commands.md", {flags: "a+"})
var wiki = ""
var generatedCategories = []

wikiFile.write(`---\ntitle: Commands\n---\n# Commands\n\nList of all commands.\nThis page was last generated at ${new Date().toISOString()}\n\n`)

for (const folder of folders) {
	const files = fs.readdirSync("./commands/" + folder).filter(file => file.endsWith(".js"))
	for (const file of files) {
		import(`../commands/${folder}/${file}`).then(module => {
			const command = module.default
			console.log(generatedCategories)

			if (!generatedCategories.includes(folder)) {
				wiki += "## " + folder.charAt(0).toUpperCase() + folder.slice(1) + "\n\n"
				generatedCategories.push(folder)
			}

			wiki += "### " + command.name + "\n"
			wiki += command.description + "\n\n"

			wiki += "**Category**: " + folder + "\n\n"
			wiki += "**Usage**: " + command.usage + "\n\n"
			if (command.cooldown) wiki += "**Cooldown**: " + command.cooldown + "\n\n"
			if (command.nsfw) wiki += "**Only works in NSFW channels or DMs!**\n\n"

			wiki += "\n\n"
			wikiFile.write(wiki)
			wiki = ""
			console.log("Generated "  + command.name)
		})
	}
}