var nodemailer = require('nodemailer');

const sendEmail = async (send_email, subject_msg, text_msg) => {
    try {
        console.log('send_email', send_email);
        
        if (!send_email) {
            console.log("Recipient email is required");
            return;
        }

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: 'piyawat2163@gmail.com',
                pass: 'wdqk mlrl hdod ynjt'
            },
        });

        let mailOptions = {
            from: "piyawat2163@gmail.com",
            to: send_email,
            subject: subject_msg,
            text: text_msg,
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Email sending failed:", error);
    }
};

module.exports = sendEmail;

