const express = require('express')
const router = express.Router()
const connectDB = require('../config/db')
const { ObjectId } = require('mongodb')

router.get('/', async (req, res) => {
	try {
		const db = await connectDB()
		const collection = db.collection('leads')
		const data = await collection.find({}).toArray()
		res.json(data)
	} catch (err) {
		console.log(err)
		res.json({ message: 'Error fetching leads' })
	}
})

router.post('/', async (req, res) => {
	try {
		const db = await connectDB()
		const collection = db.collection('leads')
		await collection.insertOne(req.body)
		res.json({ message: 'Success' })
	} catch (err) {
		res.json({ message: 'Error adding leads' })
	}
})

router.put('/:id', async (req, res) => {
	const id = req.params.id
	const data = req.body
	try {
		const db = await connectDB()
		const collection = db.collection('leads')
		await collection.findOneAndUpdate(
			{ _id: ObjectId(id) },
			{
				$set: {
					...data,
				},
			}
		)
		res.json({ message: 'Success' })
	} catch (err) {
		res.json({ message: 'Error modifying leads' })
	}
})

router.delete('/:id', async (req, res) => {
	const id = req.params.id
	try {
		const db = await connectDB()
		const collection = db.collection('leads')
		await collection.findOneAndDelete({ _id: ObjectId(id) })
		res.json({ message: 'Success' })
	} catch (err) {
		res.json({ message: 'Error deleting leads' })
	}
})

module.exports = router
