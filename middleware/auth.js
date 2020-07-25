const jwt = require('jsonwebtoken')
require('dotenv').config()

const authenticate = async (req, res, next) => {
	const token = req.headers.authenticate
	try {
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized access' })
		}

		const user = await jwt.verify(token, process.env.secret)
		req.id = user.id
		req.email = user.email
		req.role = user.role
		next()
	} catch (err) {
		console.log('Error with middleware')
		res.status(500).json({ message: 'Error' })
	}
}

module.exports = authenticate