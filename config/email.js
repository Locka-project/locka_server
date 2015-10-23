module.exports.email = {
    "sails-hook-email": {
        // load the hook into sails.hooks.emailHook instead of sails.hooks.email
        "name": "emailHook",
        // configure the hook using sails.config.emailSettings instead of sails.config.email
        "configKey": "emailSettings",
        "from": "no-reply@locka.com",
        "auth": {user: "john.dreyfus@ynov.com", pass: "PORTAL5233portal"},
    }
};