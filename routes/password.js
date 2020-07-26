const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const connectDB = require('../config/db')
const bcrypt = require('bcrypt')

require('dotenv').config()

const email = process.env.MAILER_EMAIL
const password = process.env.MAILER_PASSWORD

const forgotPasswordEmail = (firstname, url) =>
	`<div>
		<h3>Dear ${firstname},</h3>
		<p>You requested for a password reset.</p>
		<p>Kindly use this <a href=${url}>link</a> to reset your password</p>
		<br>
		<p>Thank You</p>
	</div>`

const resetPasswordConfirmation = firstname =>
	`<div>
		<h3>Dear ${firstname},</h3>
		<p>Your password has been successful reset, you can now login with your new password.</p>
		<br>
		<div>
			Cheers!
		</div>
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
		const url = `localhost:3000/register/${token}`
		const mailOptions = {
			from: `CRM Support<crmsupport@crm.com>`,
			to: user.email,
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

router.post('/resetpassword', async (req, res) => {
	try {
		const { token, password } = req.body
		const db = await connectDB()
		const collection = db.collection('users')
		const user = await collection.findOne({
			reset_password_token: token,
			reset_password_expires: { $gt: Date.now() },
		})
		if (!user) return res.status(408).json({ message: 'Token expired' })

		hash = await bcrypt.hash(password, 10)
		user.reset_password_token = undefined
		user.reset_password_expires = undefined
		await collection.findOneAndUpdate(
			{ _id: user._id },
			{
				$set: {
					password: hash,
				},
				$unset: {
					reset_password_expires: '',
					reset_password_token: '',
				},
			}
		)
		const mailOptions = {
			from: `CRM Support<crmsupport@crm.com>`,
			to: user.email,
			subject: `Reset Password Successful`,
			html: resetPasswordConfirmation(user.firstname),
		}
		sendMail(mailOptions)
		res.json({ message: 'Password successfully updated' })
	} catch (err) {
		res.json({ message: error })
	}
})
module.exports = router
