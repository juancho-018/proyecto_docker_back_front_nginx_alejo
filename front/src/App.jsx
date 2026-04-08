import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE = '/api';

function App() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [view, setView] = useState('shop'); // shop, profile, cart, orders, register
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    if (token) {
      fetchProfile();
      fetchOrders();
    }
  }, [token]);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products', err);
      // Fallback dummy products if backend not running yet
      setProducts([
        { id: '1', name: 'AeroMax Blue', brand: 'Nike', price: 129.99, stock: 10, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600' },
        { id: '2', name: 'Stealth Onyx', brand: 'Adidas', price: 159.99, stock: 5, imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600' },
        { id: '3', name: 'Crimson Vector', brand: 'Puma', price: 99.00, stock: 12, imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=600' }
      ]);
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (err) {
      console.error('Profile fetch failed');
    }
  };

  const fetchOrders = async () => {
    if (!token) return;
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const res = await fetch(`${API_BASE}/orders/user/${decoded.id}`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Orders fetch failed');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        setView('shop');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Login failed. Ensure backend is running.');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Registered successfully! Please login.');
        setView('login');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Registration failed.');
    }
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
    alert(`${product.name} added to cart!`);
  };

  const placeOrder = async () => {
    if (!user) return setView('login');
    
    for (const item of cart) {
      try {
        await fetch(`${API_BASE}/orders`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: item.id,
            quantity: 1,
            userId: user.id
          })
        });
      } catch (err) {
        console.error('Order failed', err);
      }
    }
    setCart([]);
    alert('Orders placed! Payment is being processed in the background.');
    fetchOrders();
    setView('orders');
  };

  return (
    <div className="App">
      <nav className="glass">
        <div className="container nav-content">
          <h2 className="logo" onClick={() => setView('shop')}>SHOE<span>STORE</span></h2>
          <div className="nav-links">
            <span onClick={() => setView('shop')}>Shop</span>
            {user ? (
              <>
                <span onClick={() => setView('cart')}>Cart ({cart.length})</span>
                <span onClick={() => setView('orders')}>My Orders</span>
                <span onClick={() => setView('profile')}>{user.username}</span>
                <span onClick={() => { localStorage.removeItem('token'); setToken(null); setUser(null); setOrders([]); setView('shop'); }}>Logout</span>
              </>
            ) : (
              <span onClick={() => setView('login')}>Login</span>
            )}
          </div>
        </div>
      </nav>

      <main className="container">
        {view === 'shop' && (
          <div className="animate-fade">
            <header className="hero">
              <h1>The Future of <span>Footwear</span></h1>
              <p>Experience ultimate comfort with our premium curated collection.</p>
            </header>
            
            <div className="grid">
              {products.map(p => (
                <div key={p.id} className="glass product-card">
                  <div className="product-img">
                    <img src={p.imageUrl} alt={p.name} />
                  </div>
                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <p className="brand">{p.brand}</p>
                    <div className="price-row">
                      <span className="price">${parseFloat(p.price).toFixed(2)}</span>
                      <button className="btn-primary" onClick={() => addToCart(p)}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'login' && (
          <div className="login-container glass animate-fade">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="admin@shoes.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-primary btn-block">Sign In</button>
            </form>
            <p className="auth-footer">Don't have an account? <span onClick={() => setView('register')}>Register instead</span></p>
          </div>
        )}

        {view === 'register' && (
          <div className="login-container glass animate-fade">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
              <div className="input-group">
                <label>Username</label>
                <input type="text" name="username" required placeholder="alex_runner" />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input type="email" name="email" required placeholder="alex@example.com" />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input type="password" name="password" required placeholder="••••••••" />
              </div>
              <button type="submit" className="btn-primary btn-block">Sign Up</button>
            </form>
            <p className="auth-footer">Already a member? <span onClick={() => setView('login')}>Login instead</span></p>
          </div>
        )}

        {view === 'orders' && (
          <div className="cart-container glass animate-fade">
            <h2>My Orders</h2>
            {orders.length === 0 ? <p>You haven't made any purchases yet.</p> : (
              <div className="orders-list">
                {orders.map(o => (
                  <div key={o.id} className="order-item">
                    <div className="order-header">
                      <strong>Order #{o.id.substring(0,8)}</strong>
                      <span className={`status-badge ${o.status}`}>{o.status.toUpperCase()}</span>
                    </div>
                    <div className="order-details">
                      <span>Total: ${parseFloat(o.totalPrice).toFixed(2)}</span>
                      <span>Item ID: {o.productId}</span>
                      <span>Date: {new Date(o.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'cart' && (
          <div className="cart-container glass animate-fade">
            <h2>Your Shopping Cart</h2>
            {cart.length === 0 ? <p>Your cart is empty.</p> : (
              <>
                <div className="cart-items">
                  {cart.map((item, idx) => (
                    <div key={idx} className="cart-item">
                      <span>{item.name}</span>
                      <span>${parseFloat(item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="cart-total">
                  <h3>Total: ${cart.reduce((sum, item) => sum + parseFloat(item.price), 0).toFixed(2)}</h3>
                  <button className="btn-primary" onClick={placeOrder}>Checkout Now</button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      <footer className="footer-dim">
        <p>&copy; 2026 SHOE STORE Microservices Demo. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
