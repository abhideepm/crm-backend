const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const passwordRouter = require('./routes/password')
const leadRouter = require('./routes/leads')
const contactRouter = require('./routes/contacts')
const requestRouter = require('./routes/serviceRequests')
const auth = require('../middleware/auth')

const app = express()
app.use(bodyParser.json(), cors())

const PORT = process.env.PORT || 3000

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/password', passwordRouter)
app.use('/leads', leadRouter)
app.use('/contacts', contactRouter)
app.use('/requests', contactRouter)

app.route('/auth',auth)

app.listen(PORT, () => console.log('Listening'))
