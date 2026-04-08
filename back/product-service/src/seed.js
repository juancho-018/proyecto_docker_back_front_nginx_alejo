const Product = require('./models/Product');
const sequelize = require('./config/db');

const initialProducts = [
  {
    name: 'AeroMax Blue',
    brand: 'Nike',
    price: 129.99,
    stock: 50,
    description: 'High-performance athletic sneaker with multi-layer cushioning.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Stealth Onyx',
    brand: 'Adidas',
    price: 159.99,
    stock: 25,
    description: 'Minimalist all-black designer shoe for everyday comfort.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600'
  },
  {
    name: 'Crimson Vector',
    brand: 'Puma',
    price: 99.00,
    stock: 120,
    description: 'Vibrant red running shoe with improved traction.',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600'
  }
];

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    await Product.bulkCreate(initialProducts);
    console.log('Product database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seed();
