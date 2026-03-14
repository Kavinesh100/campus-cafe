const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Order = require('../models/Order')

router.post('/', auth, async (req, res) => {
  try {
    const { items, totalAmount } = req.body
    const order = new Order({
      user: req.user.userId,
      items,
      totalAmount
    })
    await order.save()
    res.status(201).json({ message: 'Order placed!', order })
  } catch (err) {
    res.status(500).json({ message: 'Error placing order', error: err.message })
  }
})

router.get('/my', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId }).sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

module.exports = router