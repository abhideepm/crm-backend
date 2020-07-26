const nodemailer = require('nodemailer')
require('dotenv').config()

const email = process.env.MAILER_EMAIL
const password = process.env.MAILER_PASSWORD

const sendMail = async mailOptions => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: email,
			pass: password,
		},
	})

	try {
		await transporter.sendMail(mailOptions)
		console.log('Email sent')
	} catch (err) {
		console.log('Email not sent')
	}
}

module.exports = sendMail
