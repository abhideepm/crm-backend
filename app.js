const express = require('express')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const passwordRouter = require('./routes/password')

const app = express()

const PORT = process.env.PORT || 3000

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/register', registerRouter)
app.use('/login', loginRouter)
app.use('/password', passwordRouter)

app.listen(PORT, () => console.log('Listening'))
