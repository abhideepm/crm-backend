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
			const collection = db.collection('serviceRequests')
			const data = await collection.find({}).toArray()
			res.json(data)
		} catch (err) {
			console.log(err)
			res.json({ message: 'Error fetching service requests' })
		}
	}
)

router.post(
	'/',
	[auth, permit('Employee', 'Manager', 'Admin')],
	async (req, res) => {
		try {
			const db = await connectDB()
			const collection = db.collection('serviceRequests')
			const insertResponse = await collection.insertOne(req.body)
			res.json(insertResponse.ops[0])
		} catch (err) {
			res.json({ message: 'Error adding service requests' })
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
			const collection = db.collection('serviceRequests')
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
			res.json({ message: 'Error modifying service requests' })
		}
	}
)

router.delete('/:id', [auth, permit('Manager', 'Admin')], async (req, res) => {
	const id = req.params.id
	try {
		const db = await connectDB()
		const collection = db.collection('serviceRequests')
		const deleteResponse = await collection.findOneAndDelete({
			_id: ObjectId(id),
		})
		res.json(deleteResponse.value)
	} catch (err) {
		res.json({ message: 'Error deleting service requests' })
	}
})

module.exports = router
