const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const connectDB = require('../config/db')
const sendMail = require('../config/sendMail')
const forgotPassword = require('../template/forgotPassword')
const resetPassword = require('../template/resetPassword')

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
		const url = `https://dazzling-agnesi-114948.netlify.app/resetpassword/${token}`
		const mailOptions = {
			from: `CRM Support<crmsupport@crm.com>`,
			to: user.email,
			subject: `Reset Password request`,
			html: forgotPassword(user.firstname, url),
		}

		await sendMail(mailOptions)
		res.json({ message: 'Success' })
	} catch (err) {
		console.log('Forgot Password Error')
		res.status(500).json({ message: 'Error' })
	}
})

router.get('/tokenstatus/:token', async (req, res) => {
	const token = req.params.token
	const db = await connectDB()
	const collection = db.collection('users')
	const user = await collection.findOne({
		reset_password_token: token,
		reset_password_expires: { $gt: Date.now() },
	})
	if (!user) return res.json({ message: 'Token expired' })
	return res.json({ message: 'Token accepted' })
})

router.post('/resetpassword', async (req, res) => {
	try {
		const { token, password } = req.body
		const db = await connectDB()
		const collection = db.collection('users')
		const user = await collection.findOne({
			reset_password_token: token,
		})

		hash = await bcrypt.hash(password, 10)
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
			html: resetPassword(user.firstname),
		}
		sendMail(mailOptions)
		res.json({ message: 'Success' })
	} catch (err) {
		res.json({ message: error })
	}
})
module.exports = router
