const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const connectDB = require('../config/db')
require('dotenv').config()

router.use(bodyParser.json(), cors())

router.post('/', async (req, res) => {
	try {
		const db = await connectDB()
		const collection = db.collection('users')
		const user = await collection.findOne({ email: req.body.email })
		const match = await bcrypt.compare(req.body.password, user.password)
		if (match) {
			const { _id, email, type } = user
			const jwtToken = jwt.sign(
				{ id: _id, email: email, role: type },
				process.env.secret,
				{ expiresIn: '6h' }
			)
			res.send({ message: 'Success', token: jwtToken })
		} else throw new Error()
	} catch (err) {
		res.send({ message: 'Error' })
	}
})

module.exports = router
