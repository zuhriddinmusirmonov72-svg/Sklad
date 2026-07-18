require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI;

const ProductSchema = new mongoose.Schema({
  name: String, category: String, weight: Number,
  packQuantity: Number, price: Number, stock: Number, image: String,
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);

async function importData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB ga ulandi');

    const raw = fs.readFileSync(path.join(__dirname, 'database.json'), 'utf8');
    const db = JSON.parse(raw);
    const products = db.products || [];

    // Avval tozalaymiz
    await Product.deleteMany({});
    console.log('🗑️  Eski mahsulotlar o\'chirildi');

    // Import qilamiz
    const docs = products.map(p => ({
      name: p.name, category: p.category || '',
      weight: p.weight || 0, packQuantity: p.packQuantity || 1,
      price: p.price || 0, stock: p.stock || 0, image: p.image || '',
    }));

    await Product.insertMany(docs);
    console.log(`✅ ${docs.length} ta mahsulot MongoDB ga import qilindi!`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Xatolik:', err.message);
    process.exit(1);
  }
}

importData();
