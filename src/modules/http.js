// this file hosts an HTTP server on process.env.PORT or port 80
// this is intended for heroku, as heroku automatically shuts
// down the bot if an http server isn't hosted within ~1 minute
// can be disabled with config.http
import config from "../../config.json"
import npmpackage from "../../package.json"
import { log } from "./logger.js"
import http from "http"
const PORT = process.env.PORT || config.port || 80

if (config.http === true) {
	http.createServer((req, res) => {
		res.writeHead(200, {"Content-Type": "text/plain"})
		res.write(`Running Elevate v${npmpackage.version}! This is a simple HTTP server to ensure Heroku doesn't shut down the bot after ~1 minute.`)
		res.end()
	}).listen(PORT)
	log("Listening on port " + PORT)
}