var nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (send_email, subject_msg, html_msg) => {
    try {
        if (!send_email) {
            console.log("Recipient email is required");
            return;
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            },
        });

        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: send_email,
            subject: subject_msg,
            // text: text_msg,
            html: html_msg,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = sendEmail;

