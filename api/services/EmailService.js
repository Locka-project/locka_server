module.exports = {

    forgetPassword: function(user, newPassword){
        sails.hooks.email.send(
            "../../views/email/forgetPassword",
            {
                newPassword: newPassword
            }
            ,
            {
                recipientName: user.fullName(),
                senderName: "Locka Team",
            },
            {
                to: user.email,
                subject: "new password"
            },
            function(err){console.log(err || "It worked!");}
        )
    },
};