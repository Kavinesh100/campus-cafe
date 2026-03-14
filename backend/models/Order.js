const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      name: String,
      price: Number,
      qty: Number
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'preparing', 'ready', 'delivered'],
    default: 'pending'
  }
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)