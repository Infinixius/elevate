import * as fs from "fs"
import * as path from "path"
import config from "../../config.json"
import npmpackage from "../../package.json"

// splash text

console.log("Elevate v" + npmpackage.version)
console.log("Built with <3 by https://infinixius.github.io")
console.log("-----------------------")

// create "logs" directory if it doesn't exist

if (!fs.existsSync("./logs")) {
	fs.mkdirSync("./logs")
}

// handle cache directory

if (!fs.existsSync("./cache")) {
	fs.mkdirSync("./cache")
}

fs.readdir("./cache", (err, files) => {
	if (err) error("Failed to read /cache/ directory! Error: " + err)

	for (const file of files) {
		fs.unlink(path.join("./cache", file), (err) => {
			if (err) error(`"Failed to delete ${file}! Error: ${err}`)
		})
	}
})

// utility functions

function timestamp() {
	return new Date().toLocaleTimeString()
		.replace(/:/g,"-") // you can't have : in windows filenames
}

function datestamp() {
	return new Date().toLocaleDateString()
	.replace(/\//g, "-") // you can't have / in windows filenames
}

if (config.logger.enabled) {
	let name = config.logger.fileFormat
	name = name.replace("%time", timestamp())
	name = name.replace("%date", datestamp())
	
	var file = fs.createWriteStream(name, {flags: "a+"})
	file.write("KritzKast bot log file from "+timestamp()+" - "+datestamp()+"\n")
	file.write("-------------------------------------------------------------\n")
}

export function advlog(message, type) { // advanced logger function, use the ones below for ease of use
	if (!config.logger.enabled) return
	if (!config.logger[type]) return

	let log = config.logger.format

	log = log.replace("%time", timestamp())
	log = log.replace("%date", datestamp())
	log = log.replace("%type", type)
	log = log.replace("%TYPE", type.toUpperCase())
	log = log.replace("%message", message)

	console.log(log)
	file.write(log+"\n")
}

// these are self explanatory

export function log(message) {
	advlog(message, "info")
}

export function error(message) {
	advlog(message, "error")
}

export function warn(message) {
	advlog(message, "warning")
}