const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Routes
const authRoutes = require('./routes/auth')
app.use('/api/auth', authRoutes)

const orderRoutes = require('./routes/order')
app.use('/api/orders', orderRoutes)

const adminRoutes = require('./routes/admin')
app.use('/api/admin', adminRoutes)

// Test route
app.get('/', (req, res) => {
  res.send('Campus Cafe API is running!')
})

// Connect to MongoDB then start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!')
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`)
    })
  })
  .catch((err) => console.log('MongoDB error:', err))