const mongodb = require('mongodb')
require('dotenv').config()

const db = process.env.DB

const connectDB = async () => {
	try {
		const client = await mongodb.connect(db, { useUnifiedTopology: true })
		console.log('Database connected')
		return client.db('CRM')
	} catch (err) {
		console.log('Not connected')
	}
}

module.exports = connectDB
