const fetch = require("node-fetch")
const logger = require("./Logger.js")
const splash = require("../assets/splash.json")
const config = require("../config.json")
let result = {}

function check() {
	if (config.checkForUpdates == false) {
		result.outdated = false
		result.current = splash.version
		result.checkenabled = false
		return
	}
	fetch(splash.update, { headers: { "User-Agent": config.httpUserAgent, 
		"Authorization": "Basic " + Buffer.from(config.auth.github).toString("base64") } 
	})
		.then(res => res.json())
		.then(json => {
			let update = json[0]
			if ("v"+splash.version != update.tag_name) {
				result.outdated = true
				result.latest = update.tag_name
				result.current = "v"+splash.version
				result.url = update.html_url
				result.body = update.body
				result.checkenabled = true
			} else {
				result.outdated = false
				result.current = splash.version
				result.url = update.html_url
				result.body = update.body
				result.checkenabled = true
			}
		})
		.catch(error => {
			logger.error("Autoupdate fetch failed. Error: "+error)
		})
}

check()
setInterval(check, 60000)

module.exports = function() {
		return result
}