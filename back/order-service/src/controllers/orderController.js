const Order = require('../models/Order');
const axios = require('axios');

const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4042';

exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, userId } = req.body;

    // 1. Fetch product info from Product Service
    const productResponse = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}`);
    const product = productResponse.data;

    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }

    const totalPrice = product.price * quantity;

    // 2. Create pending order
    const order = await Order.create({
      userId,
      productId,
      quantity,
      totalPrice,
      status: 'pending'
    });

    // 3. Simulate Payment Processing
    setTimeout(async () => {
      const isPaymentSuccessful = Math.random() > 0.1; // 90% success rate
      if (isPaymentSuccessful) {
        await order.update({ status: 'paid', paymentId: `PAY-${Math.floor(Math.random() * 1000000)}` });
        
        // 4. Update stock in Product Service (simplified)
        await axios.put(`${PRODUCT_SERVICE_URL}/${productId}`, {
          stock: product.stock - quantity
        });
        
        console.log(`Order ${order.id} paid successfully`);
      } else {
        await order.update({ status: 'failed' });
        console.log(`Order ${order.id} payment failed`);
      }
    }, 2000); // 2 second delay for simulation

    res.status(201).json({ message: 'Order created and payment processing...', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrdersByUser = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.params.userId } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
