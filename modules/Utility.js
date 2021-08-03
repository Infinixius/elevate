module.exports.validate = function(string) {
	return string
		.replace(/[^0-9a-z -]/gi, "") // only keep alphanumerics
		.trim()
		.replace(/ +/g, "_") // replace spaces with underscores to keep it URL-safe
}

module.exports.trims = function(string, length) {
	if (!length) length = 1024 // limit for embed fields
	if (string.length > length) {
		return string.slice(length)
	} else {
		return string
	}
}