---
title: Config
---

# Config

Elevate uses `config.json` to configure parts of the bot. In a freshly cloned repository, you'll need to rename `config.template.json` to `config.json`. There is also a template at the bottom of this page.

- `token` - Authentication token obtained from the [Discord Developer Portal](https://discord.dev).
- `http` - Port of the HTTP server started alongside Elevate. This is required for hosting on Heroku, or else your bot will automatically be shut down after a minute or two. If you're hosting on Heroku, this port must be 80. Set to false if you're not hosting on Heroku.
- `dev` - Enables/disables some developer options. Should probably be `false`.

- `magickPath` - Path to your [imagemagick](https://imagemagick.org/) executable. Defaults to `magick`, assuming it's in PATH.

- `HTTPuserAgent` - User agent to be sent alongside HTTP requests. Currently only used for the `e621` command.

- `acr.host` - Host value for your ACRCloud account.
- `acr.access_key` - Access key for your ACRCloud account.
- `acr.access_secret` - Access secret for your ACRCloud account.

- `applicationID` - ID of the bot application obtained from the [Discord Developer Portal](https://discord.dev).
- `guilds` - Array of guilds to manually assign guild slash commands to. Recommended to leave this empty and just use global slash commands.

- `permissions.moderator` - Array of user IDs or role IDs to give moderator permissions.
- `permissions.admin` - Array of user IDs or role IDs to give moderator permissions.
- `permissions.root` - Array of user IDs to give root permissions.

- `logger.enabled` - Enables logging to a file and console
- `logger.format` - Format of log messages. Avaliable options: %time, %date, %type, %TYPE, %log
- `logger.fileFormat` - Format of log file names. Avaliable options: %time, %date

- `logger.info` - Basic information
- `logger.warning` - Any non-fatal warnings
- `logger.errors` - Any non-fatal errors
- `logger.debug` - Debugging information
- `logger.discord` - Information from the Discord socket

- `status.interval` - The amount of time (in milliseconds) before changing the status.
- `status.prefix` - Prefix to the current randomly selected status
- `status.suffix` - Suffix to the current randomly selected status
- `status.list` - List of statuses, randomly selected. Can start with "Watching" or "Listening to" to change the type of status

## Example

```json
{
	"token": "",
	"http": true,
	"dev": true,
	"port": 80,

	"magickPath": "magick",

	"HTTPuserAgent": "Elevate/2.0.0 (infinixius)",
	
	"acr": {
		"host": "",
		"access_key": "",
		"access_secret": ""
	},

	"applicationID": "",
	"guilds": [""],

	"permissions": {
		"moderator": [""],
		"admin": [""],
		"root": [""]
	},

	"logger": {
		"enabled": true,
		"format": "[%time][%TYPE] - %message",
		"fileFormat": "./logs/%date-%time.log",

		"info": true,
		"warning": true,
		"error": true,
		"debug": true
	},

	"status": {
		"interval": 120000,
		"prefix": "",
		"suffix": " | /help",
		"list": [
			"Status A",
			"Status B",
			"Watching Status C",
			"Listening to Status D"
		]
	}
}
```