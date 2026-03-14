const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Order = require('../models/Order')
const User = require('../models/User')

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' })
  }
  next()
}

// Get all orders
router.get('/orders', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 })
    res.json(orders)
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' })
  }
})

// Update order status
router.put('/orders/:id', auth, isAdmin, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
    res.json(order)
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' })
  }
})

// Get stats
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments()
    const totalUsers = await User.countDocuments()
    const orders = await Order.find()
    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
    const pendingOrders = await Order.countDocuments({ status: 'pending' })
    res.json({ totalOrders, totalUsers, totalRevenue, pendingOrders })
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' })
  }
})

module.exports = router