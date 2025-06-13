const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    const { customerName, customerEmail, customerPhone, items, deliveryAddress, notes } = req.body;
    
    // Calculate total amount
    let totalAmount = 0;
    for (let item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item not found: ${item.menuItem}` });
      }
      totalAmount += menuItem.price * item.quantity;
      item.price = menuItem.price;
    }

    const newOrder = new Order({
      customerName,
      customerEmail,
      customerPhone,
      items,
      totalAmount,
      deliveryAddress,
      notes
    });

    const savedOrder = await newOrder.save();
    await savedOrder.populate('items.menuItem');
    
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('items.menuItem');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
