require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], credentials: true }));
app.use(express.json());

// ==================== DATABASE MODE ====================
let useMongoose = false;
let Product, Order, CustomerOrder;

async function initDB() {
  if (MONGODB_URI) {
    try {
      const mongoose = require('mongoose');
      await mongoose.connect(MONGODB_URI);
      console.log('✅ MongoDB Atlas ga ulandi!');
      useMongoose = true;

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
        productId: mongoose.Schema.Types.Mixed,
        name: String, image: String,
        qty: Number, price: Number,
        discount: { type: Number, default: 0 },
      });

      const OrderSchema = new mongoose.Schema({
        orderNumber: String,
        customer: { type: String, required: true },
        phone: { type: String, default: '' },
        date: String,
        status: { type: String, default: "Jo'natilmagan" },
        warehouse: { type: String, default: 'Склад' },
        address: { type: String, default: '' },
        comment: { type: String, default: '' },
        currency: { type: String, default: 'USD' },
        lines: [OrderLineSchema],
        isWarehousePrinted: { type: Boolean, default: false },
      }, { timestamps: true });

      const CustomerOrderSchema = new mongoose.Schema({
        customer: String, phone: String,
        product: String, qty: Number,
        status: { type: String, default: 'pending' },
      }, { timestamps: true });

      Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
      Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
      CustomerOrder = mongoose.models.CustomerOrder || mongoose.model('CustomerOrder', CustomerOrderSchema);

    } catch (err) {
      console.log('⚠️  MongoDB ulanmadi, JSON database ishlatilmoqda:', err.message);
      useMongoose = false;
    }
  } else {
    console.log('📁 JSON database ishlatilmoqda (local mode)');
  }
}

// ==================== JSON DB FUNCTIONS ====================
function readDB() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const def = { products: [], orders: [], customerOrders: [] };
      fs.writeFileSync(DB_PATH, JSON.stringify(def, null, 2));
      return def;
    }
    const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    if (!data.customerOrders) data.customerOrders = [];
    if (!data.orders) data.orders = [];
    if (!data.products) data.products = [];
    return data;
  } catch (e) { return { products: [], orders: [], customerOrders: [] }; }
}

function writeDB(data) {
  try { fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2)); return true; }
  catch (e) { return false; }
}

// normalize JSON id to string
function norm(doc) {
  if (doc && doc.id === undefined && doc._id) doc.id = doc._id.toString();
  if (doc && doc._id) doc.id = doc._id.toString();
  return doc;
}

// ==================== SWAGGER ====================
const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'Admin Panel API', version: '4.0.0', description: 'MongoDB Atlas yoki JSON database' },
  tags: [
    { name: 'Auth' }, { name: 'Products' }, { name: 'Orders' },
  ],
  paths: {},
};
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==================== AUTH ====================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@gmail.com' && password === 'admin') {
    return res.json({ success: true, user: { email, fullName: 'Administrator', role: 'ADMIN' } });
  }
  res.status(401).json({ success: false, message: "Noto'g'ri email yoki parol" });
});

// ==================== PRODUCTS ====================
app.get('/api/products', async (req, res) => {
  try {
    if (useMongoose) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: products.map(p => norm(p.toObject())) });
    }
    const db = readDB();
    res.json({ success: true, data: db.products });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const p = await Product.findById(req.params.id);
      if (!p) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(p.toObject()) });
    }
    const db = readDB();
    const p = db.products.find(x => String(x.id) === req.params.id);
    if (!p) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, data: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/products', async (req, res) => {
  try {
    if (useMongoose) {
      const p = new Product({
        name: req.body.name, category: req.body.category || '',
        weight: req.body.weight || 0, packQuantity: req.body.packQuantity || 1,
        price: req.body.price || 0, stock: req.body.stock || 0, image: req.body.image || '',
      });
      await p.save();
      return res.json({ success: true, data: norm(p.toObject()) });
    }
    const db = readDB();
    const p = { id: Date.now(), name: req.body.name, category: req.body.category || '',
      weight: req.body.weight, packQuantity: req.body.packQuantity,
      price: req.body.price, stock: req.body.stock, image: req.body.image || '',
      createdAt: new Date().toISOString() };
    db.products.push(p);
    writeDB(db);
    res.json({ success: true, data: p });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const p = await Product.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
      if (!p) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(p.toObject()) });
    }
    const db = readDB();
    const i = db.products.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    db.products[i] = { ...db.products[i], ...req.body, updatedAt: new Date().toISOString() };
    writeDB(db);
    res.json({ success: true, data: db.products[i] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const p = await Product.findByIdAndDelete(req.params.id);
      if (!p) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(p.toObject()) });
    }
    const db = readDB();
    const i = db.products.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    const deleted = db.products.splice(i, 1);
    writeDB(db);
    res.json({ success: true, data: deleted[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== ORDERS ====================
app.get('/api/orders', async (req, res) => {
  try {
    if (useMongoose) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: orders.map(o => norm(o.toObject())) });
    }
    const db = readDB();
    res.json({ success: true, data: db.orders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const o = await Order.findById(req.params.id);
      if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const o = db.orders.find(x => String(x.id) === req.params.id);
    if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
    res.json({ success: true, data: o });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/orders', async (req, res) => {
  try {
    if (useMongoose) {
      const o = new Order({
        orderNumber: req.body.orderNumber || `ORD-${Date.now().toString().slice(-6)}`,
        customer: req.body.customer, phone: req.body.phone || '',
        date: req.body.date || new Date().toISOString(),
        status: req.body.status || "Jo'natilmagan",
        warehouse: req.body.warehouse || 'Склад',
        address: req.body.address || '', comment: req.body.comment || '',
        currency: req.body.currency || 'USD', lines: req.body.lines || [],
        isWarehousePrinted: req.body.isWarehousePrinted || false,
      });
      await o.save();
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const o = { id: Date.now(),
      orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
      customer: req.body.customer, phone: req.body.phone || '',
      date: req.body.date || new Date().toISOString(),
      status: req.body.status || "Jo'natilmagan",
      warehouse: req.body.warehouse || 'Склад',
      address: req.body.address || '', comment: req.body.comment || '',
      currency: req.body.currency || 'USD', lines: req.body.lines || [],
      isWarehousePrinted: req.body.isWarehousePrinted || false,
      createdAt: new Date().toISOString() };
    db.orders.push(o);
    writeDB(db);
    res.json({ success: true, data: o });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const o = await Order.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });
      if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const i = db.orders.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    db.orders[i] = { ...db.orders[i], ...req.body, updatedAt: new Date().toISOString() };
    writeDB(db);
    res.json({ success: true, data: db.orders[i] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const o = await Order.findByIdAndDelete(req.params.id);
      if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const i = db.orders.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    const deleted = db.orders.splice(i, 1);
    writeDB(db);
    res.json({ success: true, data: deleted[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== CUSTOMER ORDERS ====================
app.get('/api/customer-orders', async (req, res) => {
  try {
    if (useMongoose) {
      const orders = await CustomerOrder.find().sort({ createdAt: -1 });
      return res.json({ success: true, data: orders.map(o => norm(o.toObject())) });
    }
    const db = readDB();
    res.json({ success: true, data: db.customerOrders });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.post('/api/customer-orders', async (req, res) => {
  try {
    if (useMongoose) {
      const o = new CustomerOrder({ ...req.body, status: req.body.status || 'pending' });
      await o.save();
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const o = { id: Date.now(), ...req.body, status: req.body.status || 'pending', createdAt: new Date().toISOString() };
    db.customerOrders.push(o);
    writeDB(db);
    res.json({ success: true, data: o });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.put('/api/customer-orders/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const o = await CustomerOrder.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const i = db.customerOrders.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    db.customerOrders[i] = { ...db.customerOrders[i], ...req.body };
    writeDB(db);
    res.json({ success: true, data: db.customerOrders[i] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.delete('/api/customer-orders/:id', async (req, res) => {
  try {
    if (useMongoose) {
      const o = await CustomerOrder.findByIdAndDelete(req.params.id);
      if (!o) return res.status(404).json({ success: false, message: 'Topilmadi' });
      return res.json({ success: true, data: norm(o.toObject()) });
    }
    const db = readDB();
    const i = db.customerOrders.findIndex(x => String(x.id) === req.params.id);
    if (i === -1) return res.status(404).json({ success: false, message: 'Topilmadi' });
    const deleted = db.customerOrders.splice(i, 1);
    writeDB(db);
    res.json({ success: true, data: deleted[0] });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== CUSTOMERS ====================
app.get('/api/customers', async (req, res) => {
  try {
    if (useMongoose) {
      const customers = await Order.distinct('customer');
      return res.json({ success: true, data: customers.filter(Boolean) });
    }
    const db = readDB();
    const customers = [...new Set(db.orders.map(o => o.customer).filter(Boolean))];
    res.json({ success: true, data: customers });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== STATS ====================
app.get('/api/stats', async (req, res) => {
  try {
    if (useMongoose) {
      const [tp, to, co, po, ca] = await Promise.all([
        Product.countDocuments(), Order.countDocuments(),
        Order.countDocuments({ status: "Jo'natilgan" }),
        Order.countDocuments({ status: "Jo'natilmagan" }),
        Order.countDocuments({ status: 'Bekor qilindi' }),
      ]);
      return res.json({ success: true, data: { totalProducts: tp, totalOrders: to, completedOrders: co, pendingOrders: po, canceledOrders: ca } });
    }
    const db = readDB();
    res.json({ success: true, data: {
      totalProducts: db.products.length, totalOrders: db.orders.length,
      completedOrders: db.orders.filter(o => o.status === "Jo'natilgan").length,
      pendingOrders: db.orders.filter(o => o.status === "Jo'natilmagan").length,
      canceledOrders: db.orders.filter(o => o.status === 'Bekor qilindi').length,
    }});
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

// ==================== IMPORT FROM JSON (bir martalik) ====================
app.post('/api/admin/import-json', async (req, res) => {
  if (!useMongoose) return res.status(400).json({ success: false, message: 'MongoDB ishlamayapti' });
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const db = JSON.parse(raw);
    const products = db.products || [];

    let imported = 0;
    for (const p of products) {
      const exists = await Product.findOne({ name: p.name, weight: p.weight, packQuantity: p.packQuantity });
      if (!exists) {
        await Product.create({
          name: p.name, category: p.category || '',
          weight: p.weight || 0, packQuantity: p.packQuantity || 1,
          price: p.price || 0, stock: p.stock || 0, image: p.image || '',
        });
        imported++;
      }
    }
    res.json({ success: true, message: `${imported} ta yangi mahsulot import qilindi`, total: products.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ==================== HEALTH ====================
app.get('/api/health', async (req, res) => {
  try {
    const db = useMongoose
      ? { products: await Product.countDocuments(), orders: await Order.countDocuments() }
      : { products: readDB().products.length, orders: readDB().orders.length };
    res.json({ success: true, message: 'Server ishlamoqda!',
      database: useMongoose ? 'MongoDB Atlas' : 'JSON (local)',
      ...db, timestamp: new Date().toISOString() });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
});

app.use((req, res) => res.status(404).json({ success: false, message: 'API endpoint topilmadi' }));

// ==================== START ====================
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════╗
║   Admin Panel Backend                                 ║
║   URL:     http://localhost:${PORT}                        ║
║   Swagger: http://localhost:${PORT}/api-docs               ║
║   DB:      ${useMongoose ? 'MongoDB Atlas ☁️ ' : 'JSON local  📁'}                        ║
╚═══════════════════════════════════════════════════════╝
    `);
  });
});
