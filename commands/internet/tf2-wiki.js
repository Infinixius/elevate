const fetch = require("node-fetch")
const jsdom = require("jsdom")
const { JSDOM } = jsdom
const response = require("../../modules/Response.js")
const logger = require("../../modules/Logger.js")

module.exports = {
	name: "tf2-wiki",
	description: "Fetches information from the Team Fortress 2 wiki.",
	aliases: ["tf2wiki", "tfwiki", "tf-wiki"],
	category: "internet",
	args: true,
	usage: "(page name)",
	cooldown: 10,
	async execute(message, args, context) {
		// fullArgs is defined here because regular args doesnt include the command itself
		const fullArgs = message.content.trim().split(/ +/)
		let search = message.content.slice(fullArgs[0].length)
			.replace(/[^0-9a-z ]/gi, "") // only keep alphanumerics
			.trim()
			.replace(" ", "_") // replace spaces with underscores to keep it URL-safe
		console.log(search)
		await message.react("👀")
		fetch("https://wiki.teamfortress.com/wiki/"+search)
			.then(res => res.text())
			.then(text => {
				const dom = new JSDOM(text)
				let embed = { color: "f08149", fields: [], author: { name: "Team Fortress 2 Official Wiki" } }
				embed.footer = {
					text: "Requested by "+message.author.username,
					icon_url: message.author.avatarURL({ format: "png", size: 256 })
				}
				let stats = []
				let info = []
				let misc = []
				embed.url = "https://wiki.teamfortress.com/wiki/"+search
				console.log(embed.url)
				embed.title = dom.window.document.getElementById("firstHeading").textContent
				embed.description = dom.window.document.querySelector("p").textContent
				let url = dom.window.document.querySelector("img").src
				if (url) embed.thumbnail = {url: "http://wiki.teamfortress.com"+url}
				
				// weapon stats
				for (const stat of dom.window.document.getElementsByClassName("att_positive")) {
					if (!stats.includes("✅"+stat.textContent)) {
						stats.push("✅"+stat.textContent)
					}
				}
				for (const stat of dom.window.document.getElementsByClassName("att_negative")) {
					if (!stats.includes("⛔"+stat.textContent)) {
						stats.push("⛔"+stat.textContent)
					}
				}
				for (const stat of dom.window.document.getElementsByClassName("att_neutral")) {
					if (!stats.includes(stat.textContent)) {
						stats.push(stat.textContent)
					}
				}
				if (stats.length > 0) {
					embed.fields.push({ name: "Weapon stats", value: stats.join("\n") })
				}
				
				// get info
				for (const i of dom.window.document.getElementsByClassName("infobox-data")) {
					if (i.textContent.search("Patch") != -1) {
						info.push("**Released: **"+i.textContent)
					}
				}
				
				for (const i of dom.window.document.getElementsByClassName("infobox-label")) {
					if (i.textContent.search("Availability") != -1) {
						info.push("**Availability: **"+i.nextSibling.textContent)
					}
				}
				
				// check tradable status
				if (text.search(`Tradable</span>:</a></td><td class="infobox-data">Yes</td>`) != -1) {
					misc.push("Tradable")
				} else if (text.search(`Tradable</span>:</a></td><td class="infobox-data">No</td>`) != -1) {
					misc.push("Not tradable")
				}
				
				// check nameable status
				if (text.search(`Nameable</span>:</a></td><td class="infobox-data">Yes</td>`) != -1) {
					misc.push("Nameable")
				} else if (text.search(`Nameable</span>:</a></td><td class="infobox-data">No</td>`) != -1) {
					misc.push("Not nameable")
				}
				
				if (misc.length > 0) info.push("`"+misc.join(", ")+"`")
				if (info.length > 0) {
					embed.fields.push({ name: "Additional info", value: info.join("\n") })
				}
				
				console.log(embed)
				message.reply({embeds: [embed]})
		})
		.catch(error => {
			message.reply(response(message, "error", "negative", message.author, { 
				description: "Failed to make HTTP request!",
				error: error
			}))
		})
		
		/*fetch(url)
			.then(res => res.text())
			.then(text => {
				const dom = new JSDOM(text)
				console.log(dom.window.document.querySelector('title').textContent)
				let embed = {}
				embed.title = dom.window.document.getElementById("firstHeading").innerText
				embed.description = "text: "+dom.window.document.getElementById("mw-content-text").innerText
				message.reply({embeds: [embed]})
			})
			.catch(error => {
				message.reply(response(message, "error", "negative", message.author, { 
					description: "Failed to make HTTP request!",
					error: error
				}))
			})
			*/
	},
};