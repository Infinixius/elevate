const fs = require("fs")
const config = require("../config.json")

function timestamp() {
	return new Date().toLocaleTimeString()
}
function datestamp() {
	return new Date().toLocaleDateString()
}
module.exports.timestamp = timestamp
module.exports.datestamp = datestamp

if (config.logger.enabled) {
	let name = config.logger.fileFormat
	name = name.replace("%time", timestamp())
	name = name.replace("%date", datestamp().replace(/\//g, "-"))
	
	var file = fs.createWriteStream(name, {flags: "a+"})
	file.write("Elevate log file from "+timestamp()+" - "+datestamp()+"\n")
}

module.exports.log = function(message, type) {
	if (!config.logger.enabled) return
	if (!config.logger[type]) return
	let log = config.logger.format
	log = log.replace("%time", timestamp())
	log = log.replace("%date", datestamp())
	log = log.replace("%type", type)
	log = log.replace("%TYPE", type.toUpperCase())
	log = log.replace("%log", message)
	console.log(log)
	file.write(log+"\n")
}

module.exports.error = function(message) {
	module.exports.log(message, "error")
}