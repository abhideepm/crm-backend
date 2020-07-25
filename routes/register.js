const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const connectDB = require('../config/db')

router.use(bodyParser.json())

router.post('/', async (req, res) => {
	try {
		const db = await connectDB()
		const collection = db.collection('users')
		const userExists = await collection.findOne({ email: req.body.email })
		if (userExists) res.send({ message: 'User already exists' })
		else {
			const password = req.body.password
			const salt = await bcrypt.genSalt(10)
			req.body.password = await bcrypt.hash(password, salt)
			await collection.insertOne(req.body)
			res.send({ message: 'User registration successful' })
		}
	} catch (err) {
		res.send({ message: 'User registration error' })
	}
})

module.exports = router
