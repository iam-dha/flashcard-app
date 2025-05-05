const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: process.env.MAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendOtpEmail = async (to, otp) => {
    const mailOptions = {
        from: `"MyApp Support" <${process.env.MAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        html: `
          <h2>🔐 Your OTP Code</h2>
          <p>Here is your OTP code to register: <b>${otp}</b></p>
          <p>This code will expire in 5 minutes.</p>
        `,
    };
    await transporter.sendMail(mailOptions);
};

module.exports.sendOtpEmail = sendOtpEmail;
