const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], credentials: true }));
app.use(express.json());

// ==================== MONGOOSE SCHEMAS ====================

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, default: '' },
  weight: { type: Number, default: 0 },
  packQuantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  image: { type: String, default: '' },
}, { timestamps: true });

const OrderLineSchema = new mongoose.Schema({
  productId: Number,
  name: String,
  image: String,
  qty: Number,
  price: Number,
  discount: { type: Number, default: 0 },
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String },
  customer: { type: String, required: true },
  phone: { type: String, default: '' },
  date: { type: String },
  status: { type: String, default: "Jo'natilmagan" },
  warehouse: { type: String, default: 'Склад' },
  address: { type: String, default: '' },
  comment: { type: String, default: '' },
  currency: { type: String, default: 'USD' },
  lines: [OrderLineSchema],
  isWarehousePrinted: { type: Boolean, default: false },
}, { timestamps: true });

const CustomerOrderSchema = new mongoose.Schema({
  customer: String,
  phone: String,
  product: String,
  qty: Number,
  status: { type: String, default: 'pending' },
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const Order = mongoose.model('Order', OrderSchema);
const CustomerOrder = mongoose.model('CustomerOrder', CustomerOrderSchema);

// ==================== MONGODB ULANISH ====================
async function connectDB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable topilmadi!');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Atlas ga ulandi!');
  } catch (err) {
    console.error('❌ MongoDB ulanishda xatolik:', err.message);
    process.exit(1);
  }
}

// ==================== SWAGGER ====================
const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Admin Panel API', version: '4.0.0', description: 'MongoDB Atlas bilan ishlaydi' },
  tags: [
    { name: 'Auth', description: 'Login' },
    { name: 'Products', description: 'Mahsulotlar' },
    { name: 'Orders', description: 'Buyurtmalar' },
  ],
  paths: {},
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin') {
    return res.json({ success: true, message: 'Kirish muvaffaqiyatli', user: { email, fullName: 'Administrator', role: 'ADMIN' } });
  }
  res.status(401).json({ success: false, message: "Noto'g'ri email yoki parol" });
});

// ==================== PRODUCTS ====================
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product({
      name: req.body.name,
      category: req.body.category || '',
      weight: req.body.weight || 0,
      packQuantity: req.body.packQuantity || 1,
      price: req.body.price || 0,
      stock: req.body.stock || 0,
      image: req.body.image || '',
    });
    await product.save();
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== ORDERS ====================
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order({
      orderNumber: req.body.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
      customer: req.body.customer,
      phone: req.body.phone || '',
      date: req.body.date || new Date().toISOString(),
      status: req.body.status || "Jo'natilmagan",
      warehouse: req.body.warehouse || 'Склад',
      address: req.body.address || '',
      comment: req.body.comment || '',
      currency: req.body.currency || 'USD',
      lines: req.body.lines || [],
      isWarehousePrinted: req.body.isWarehousePrinted || false,
    });
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== CUSTOMER ORDERS ====================
app.get('/api/customer-orders', async (req, res) => {
  try {
    const orders = await CustomerOrder.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/customer-orders', async (req, res) => {
  try {
    const order = new CustomerOrder({ ...req.body, status: req.body.status || 'pending' });
    await order.save();
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/customer-orders/:id', async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Zakas topilmadi' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.delete('/api/customer-orders/:id', async (req, res) => {
  try {
    const order = await CustomerOrder.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Zakas topilmadi' });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== CUSTOMERS ====================
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Order.distinct('customer');
    res.json({ success: true, data: customers.filter(Boolean) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/customers/search', async (req, res) => {
  try {
    const query = req.query.q || '';
    if (!query.trim()) return res.json({ success: true, data: [] });
    const customers = await Order.distinct('customer', { customer: { $regex: query, $options: 'i' } });
    res.json({ success: true, data: customers.filter(Boolean).slice(0, 10) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== STATS ====================
app.get('/api/stats', async (req, res) => {
  try {
    const [totalProducts, totalOrders, completedOrders, pendingOrders, canceledOrders] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ status: "Jo'natilgan" }),
      Order.countDocuments({ status: "Jo'natilmagan" }),
      Order.countDocuments({ status: 'Bekor qilindi' }),
    ]);
    res.json({ success: true, data: { totalProducts, totalOrders, completedOrders, pendingOrders, canceledOrders } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== HEALTH ====================
app.get('/api/health', async (req, res) => {
  try {
    const [products, orders] = await Promise.all([Product.countDocuments(), Order.countDocuments()]);
    res.json({ success: true, message: 'Server ishlamoqda!', database: 'MongoDB Atlas', products, orders, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database bilan muammo', error: err.message });
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API endpoint topilmadi' });
});

// ==================== START ====================
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   Admin Panel Backend - MongoDB Atlas                 ║
║                                                       ║
║   URL:      http://localhost:${PORT}                       ║
║   Swagger:  http://localhost:${PORT}/api-docs              ║
║   Database: MongoDB Atlas (doimiy)                    ║
║                                                       ║
║   GET/POST/PUT/DELETE /api/products                   ║
║   GET/POST/PUT/DELETE /api/orders                     ║
║   GET/POST/PUT/DELETE /api/customer-orders            ║
║   GET                 /api/health                     ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
});
