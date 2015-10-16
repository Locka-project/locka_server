module.exports = {

    forgetPassword: function(options){
        sails.hooks.email.send(
            "../../views/email/forgetPassword",
            {
                recipientName: "Joe",
                senderName: "Sue"
            },
            {
                to: "joe@example.com",
                subject: "Hi there"
            },
            function(err) {console.log(err || "It worked!");}
        )
    },
};