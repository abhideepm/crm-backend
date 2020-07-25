const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const cors = require('cors')
const connectDB = require('../config/db')
const { ObjectId } = require('mongodb')

require('dotenv').config()

router.use(bodyParser.json(), cors())

const email = process.env.MAILER_EMAIL
const password = process.env.MAILER_PASSWORD
const url = 'abc'

const forgotPasswordEmail = (firstname, url) =>
	`<div>
				<h3>Dear ${firstname},</h3>
				<p>You requested for a password reset.</p>
				<p>Kindly use this <a href=${url}>link</a> to reset your password</p>
				<br>
				<p>Thank You</p>
	</div>`

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

router.post('/forgotpassword', async (req, res) => {
	try {
		const { email } = req.body
		const db = await connectDB()
		const collection = db.collection('users')
		//Check user is present in DB
		const user = await collection.findOne({ email: email })
		if (!user) return res.json({ message: 'User not found' })

		//Create a token
		const token = require('crypto').randomBytes(16).toString('hex')

		await collection.updateOne(
			{ _id: user._id },
			{
				$set: {
					reset_password_token: token,
					reset_password_expires: Date.now() + 15 * 60 * 1000,
				},
			},
			{
				upsert: true,
			}
		)

		const mailOptions = {
			from: `CRM Support<crmsupport@crm.com>`,
			to: `abhideepm@gmail.com`,
			subject: `Reset Password request`,
			html: forgotPasswordEmail(user.firstname, url),
		}

		await sendMail(mailOptions)
		res.json({ message: 'Success' })
	} catch (err) {
		console.log('Forgot Password Error')
		res.status(500).json({ message: 'Error' })
	}
})

module.exports = router
