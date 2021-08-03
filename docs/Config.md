---
title: Config
---

# Config

Elevate uses `config.json` to configure parts of the bot. In a freshly cloned repository, you'll need to rename `config.template.json` to `config.json`

- `token` - Authentication token obtained from the [Discord Developer Portal](https://discord.dev)
- `prefix` - Prefix used for commands. Example: `>help`
- `checkForUpdates` - Enable/disable update checking every time the bot starts. If disabled the bot will always assume it's on the latest version.

- `modules` - Enable/disable entire modules of commands


- `allowNSFWAnywhere` - Enable/disable NSFW commands being locked to NSFW channels.

- `httpUserAgent` - User agent used for HTTP(S) requests.
- `rule34Instance` - Instance of https://github.com/KuroZen/r34-json-api

- `auth.github` - Github personal access token/OAuth token. Optional, but required if you don't want to get hit with a 60 request per hour ratelimit from the update checker.

- `allowAdministratorOverride` - Allows the administrator role permission to override all permissions. Example: If a command requires manage messages, having administrator works too. If a command requires botowner, administrator will not work.
- `globalPermissions` - A list of user IDs that override all permissions
- `globalPermissions.botowner` - Used to give access to commands such as eval and stop.

- `logger.enabled` - Enables logging to a file and console
- `logger.format` - Format of log messages. Avaliable options: %time, %date, %type, %TYPE, %log
- `logger.fileFormat` - Format of log file names. Avaliable options: %time, %date

- `logger.info` - Basic information
- `logger.errors` - Any non-fatal errors
- `logger.debug` - Debugging information
- `logger.discord` - Information from the Discord socket

- `status.prefix` - Prefix to the current randomly selected status
- `status.suffix` - Suffix to the current randomly selected status
- `status.list` - List of statuses, randomly selected. Can start with "Watching" or "Listening to" to change the type of status