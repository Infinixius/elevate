import Discord from "discord.js"
import checkPermissions from "./commands.permissions.js"

var cooldowns = new Discord.Collection()

export default function(interaction, command) {
	if (checkPermissions(["ROOT"], interaction.member)) return
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection())
	}

	const now = Date.now()
	const timestamps = cooldowns.get(command.name)
	const cooldownAmount = (command.cooldown || 3) * 1000

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000
			return timeLeft
		}
	}
	
	timestamps.set(interaction.user.id, now)
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount)
}