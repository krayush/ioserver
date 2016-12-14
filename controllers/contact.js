var contactData = require("../config/contactInfo");
var nodemailer = require('nodemailer');

// send e-mail controller
module.exports = {
    sendSupportMail: function(receiver, subject, content) {
        // create reusable transporter object using SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: contactData.sender.fromEmail,
                pass: contactData.sender.emailPassword
            }
        });
        
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: contactData.mailOptions.fromEmail, // sender address
            to: receiver,
            subject: subject,
            html: content
        };

        // send e-mail through nodemailerf
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("Error while sending mail::", error);
            } else {
                console.log("Message sent success: " + info.response);
            }
        });
    }
};