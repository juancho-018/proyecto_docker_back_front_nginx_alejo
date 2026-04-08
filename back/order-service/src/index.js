require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const orderRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 4043;

app.use(cors());
app.use(express.json());

app.use('/', orderRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Order Database connected');
  app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
