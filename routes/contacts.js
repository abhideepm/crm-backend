const express = require('express')
const router = express.Router()
const connectDB = require('../config/db')
const { ObjectId } = require('mongodb')
const permit = require('../middleware/permit')
const auth = require('../middleware/auth')

router.get(
	'/',
	[auth, permit('Employee', 'Manager', 'Admin')],
	async (req, res) => {
		try {
			const db = await connectDB()
			const collection = db.collection('contacts')
			const data = await collection.find({}).toArray()
			res.json(data)
		} catch (err) {
			console.log(err)
			res.json({ message: 'Error fetching contacts' })
		}
	}
)

router.post(
	'/',
	[auth, permit('Employee', 'Manager', 'Admin')],
	async (req, res) => {
		try {
			const db = await connectDB()
			const collection = db.collection('contacts')
			const insertResponse = await collection.insertOne(req.body)
			res.json(insertResponse.ops[0])
		} catch (err) {
			res.json({ message: 'Error adding contacts' })
		}
	}
)

router.put(
	'/:id',
	[auth, permit('Employee', 'Manager', 'Admin')],
	async (req, res) => {
		const id = req.params.id
		const data = req.body
		try {
			const db = await connectDB()
			const collection = db.collection('contacts')
			const updateResponse = await collection.findOneAndUpdate(
				{ _id: ObjectId(id) },
				{
					$set: {
						...data,
					},
				}
			)
			res.json(updateResponse.value)
		} catch (err) {
			res.json({ message: 'Error modifying contacts' })
		}
	}
)

router.delete('/:id', [auth, permit('Manager', 'Admin')], async (req, res) => {
	const id = req.params.id
	try {
		const db = await connectDB()
		const collection = db.collection('contacts')
		const deleteResponse = await collection.findOneAndDelete({
			_id: ObjectId(id),
		})
		res.json(deleteResponse.value)
	} catch (err) {
		res.json({ message: 'Error deleting contacts' })
	}
})

module.exports = router
