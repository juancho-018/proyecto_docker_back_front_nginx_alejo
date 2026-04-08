require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 4042;

app.use(cors());
app.use(express.json());

app.use('/', productRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Product Database connected');
  app.listen(PORT, () => {
    console.log(`Product Service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
