import config from "../../config.json"

export default function(permissions, member) {
	var allowed = false

	if (!permissions) return true // command doesn't have the permissions parameter, return true
	
	for (const permission of permissions) {
		switch (permission) {
			case "MODERATOR":
				if (config.permissions.moderator.find(perm => perm == member.user.id)) allowed = true // check if user id found
				for (roleID of config.permissions.moderator) {
					if (member.roles.cache.has(roleID)) allowed = true // check if role id found
				}
				break
			case "ADMIN":
				if (config.permissions.admin.find(perm => perm == member.user.id)) allowed = true // check if user id found
				for (roleID of config.permissions.admin) {
					if (member.roles.cache.has(roleID)) allowed = true // check if role id found
				}
				break
			case "ROOT":
				if (config.permissions.root.find(perm => perm == member.user.id)) allowed = true // check if user id found
				// don't support role ids!
				break
			default:
				if (permission == member.user.id) allowed = true // check if user id is a allowed permission
				if (member.roles.cache.has(permission)) allowed = true // check if the user has the allowed role
				break
		}
	}
	
	return allowed
}