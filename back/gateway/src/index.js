require('dotenv').config();
const express = require('express');
const cors = require('cors');
const proxy = require('express-http-proxy');

const app = express();
const PORT = process.env.PORT || 4040;

app.use(cors());
app.use(express.json());

// Service Endpoints
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:4041';
const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:4042';
const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://localhost:4043';

// Proxy Routes
app.use('/auth', proxy(AUTH_SERVICE));
app.use('/products', proxy(PRODUCT_SERVICE));
app.use('/orders', proxy(ORDER_SERVICE));

app.get('/', (req, res) => {
  res.json({ message: 'Shoe System API Gateway is running on port 4040' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
