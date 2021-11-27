import fetch from "node-fetch"
import fs from "fs"
import path from "path"
import sizeOf from "image-size" // yes, getting image dimensions is possible with imagemagick but i'm lazy
import { exec } from "child_process"
import config from "../../config.json"
//import { error } from "./logger.js"

export async function download(url, path) {
	return new Promise(async (resolve, reject) => {
		const res = await fetch(url)
		const file = fs.createWriteStream(path)
		res.body.pipe(file)

		file.on("error", (err) => { reject(err) })
		
		file.on("finish", () => { resolve(path) })
	})
}

var overlayCache = 0
export async function overlay(imageAURL, imageB) { // imageA must be a URL, imageB must be a file on disk
	return new Promise(async (resolve, reject) => {
		overlayCache++
		var image = await fetch(imageAURL)
		var imagePath = `./cache/overlay${overlayCache}`
		var file = fs.createWriteStream(imagePath + ".png")
		image.body.pipe(file)

		file.on("error", (err) => { reject(err) })
		file.on("finish", () => {
			const source = path.join(process.cwd(), imagePath + ".png")
			const overlay = path.join(process.cwd(), imageB)
			const result = path.join(process.cwd(), imagePath + "_overlayed.png")
			try {
				exec(`${config.magickPath} convert -composite -resize 1080x1080 -gravity center ${source} ${overlay} ${result}`, (err, stdout, stderr) => {
					if (err) return reject(err)
					resolve(result)
				})
			} catch (error) {
				reject(error)
			}
		})
	})
}

export async function caption(image, captionUnfiltered) { // image must be a file on disk
	var caption = captionUnfiltered
		.replace(/\W /g, "")
		.trim()
		.slice(0,512)
	
	return new Promise(async (resolve, reject) => {
		try {
			const font = path.join(process.cwd(), "assets/fonts/caption.otf")
			const fileType = image.split(".")[image.split(".").length - 1]
			const result = `${image}_caption.${fileType}`
			const imageSize = sizeOf(image)
			const size = `${imageSize.width}x${imageSize.height / 4}`
			var echoCommand = `echo | set /p="${caption}"` // hacky way to use echo without the newline on windows
			if (process.platform != "win32") echoCommand = `echo -n ${caption}` // assume linux

			exec(`${echoCommand} | ${config.magickPath} convert ${image} -size ${size} -gravity center -font ${font} caption:@- +swap -append ${result}`, (err, stdout, stderr) => {
				if (err) return reject(err)
				resolve(result)
			})
		} catch (error) {
			reject(error)
		}
	})
}