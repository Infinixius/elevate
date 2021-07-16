const Jimp = require("jimp")
const logger = require("./Logger.js")

// overlays an image over another with a customizable transparency
module.exports.overlay = async function(imageA, imageB, transparency) {
	const background = await Jimp.read(imageA)
	const overlay = await Jimp.read(imageB)
	overlay.resize(background.bitmap.width, background.bitmap.height)
	background.composite(overlay, 0, 0, {
	    mode: Jimp.BLEND_SOURCE_OVER,
	    opacityDest: 1,
	    opacitySource: transparency
	})
	
	return background.getBufferAsync(Jimp.AUTO)
}