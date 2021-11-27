import config from "../../config.json"
var client

function updateStatus() {
	var status = config.status.prefix + config.status.list.random() + config.status.suffix
	if (new Date().toISOString().slice(0, 10).slice(5) == "11-27") { // elevate's birthday
		client.user.setActivity(config.status.prefix + "🎉 1 YEAR!" + config.status.suffix)
	} else if (status.startsWith("Watching")){
		client.user.setActivity(status.cut("Watching "), { type: "WATCHING" })
	} else if (status.startsWith("Listening to")){
		client.user.setActivity(status.cut("Listening to "), { type: "LISTENING" })
	} else {
		client.user.setActivity(status)
	}
}
export default function(clientArg) { // function ran in index.js to initalize status
	client = clientArg
	setInterval(updateStatus, config.status.interval)
	updateStatus()
}