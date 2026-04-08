require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4041;

app.use(cors());
app.use(express.json());

app.use('/', authRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Auth Database connected');
  app.listen(PORT, () => {
    console.log(`Auth Service running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
