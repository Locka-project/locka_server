module.exports.autoreload = {
	active: true,
	usePolling: false,
	dirs: [
		"api/models",
		"api/services",
		"api/controllers",
		"api/responses",
		"api/policies",
		"config/locales"
	],
	ignored: []
}