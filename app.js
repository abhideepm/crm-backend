const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')

const indexRouter = require('./routes/index')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const passwordRouter = require('./routes/password')
const leadRouter = require('./routes/leads')
const contactRouter = require('./routes/contacts')
const requestRouter = require('./routes/serviceRequests')
require('dotenv').config()

const app = express()
app.use(bodyParser.json(), cors())
app.options('https://dazzling-agnesi-114948.netlify.app/', cors())

const PORT = process.env.PORT || 5001

app.use('/', indexRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/password', passwordRouter)
app.use('/leads', leadRouter)
app.use('/contacts', contactRouter)
app.use('/requests', requestRouter)

app.get('/auth', async (req, res) => {
	const token = req.headers.authenticate
	console.log(token)
	try {
		if (!token) {
			return res.status(401).json({ message: 'Unauthorized access' })
		}

		const user = await jwt.verify(token, process.env.secret)
		res.json({ ...user })
	} catch (err) {
		console.log('Error with middleware')
		res.json({ message: 'Token Expired' })
	}
})

app.listen(PORT, () => console.log('Listening'))
