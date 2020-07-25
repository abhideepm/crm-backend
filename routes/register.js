const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const connectDB = require('../config/db')

router.post('/', async (req, res) => {
	try {
		const db = await connectDB()
		const collection = db.collection('users')

		const userExists = await collection.findOne({ email: req.body.email })
		if (userExists) return res.send({ message: 'User already exists' })

		const password = req.body.password
		const salt = await bcrypt.genSalt(10)
		req.body.password = await bcrypt.hash(password, salt)
		await collection.insertOne(req.body)
		res.send({ message: 'Success' })
	} catch (err) {
		res.send({ message: 'User registration error' })
	}
})

module.exports = router
