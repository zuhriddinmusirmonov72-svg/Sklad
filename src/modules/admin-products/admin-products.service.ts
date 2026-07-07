import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { UpdateAdminProductDto } from './dto/update-admin-product.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminProductsService {
  private readonly dbPath = 'd:\\beckend\\Admin\\backend\\database.json';

  // Database ni o'qish
  private readDatabase() {
    try {
      const data = fs.readFileSync(this.dbPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return { products: [], orders: [] };
    }
  }

  // Database ga yozish
  private writeDatabase(data: any) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error('Database ga yozish xatosi:', error);
      return false;
    }
  }

  // Barcha mahsulotlar
  async findAll() {
    const db = this.readDatabase();
    return db.products || [];
  }

  // Bitta mahsulot
  async findOne(id: string) {
    const db = this.readDatabase();
    const product = db.products.find((p: any) => p.id === parseInt(id));

    if (!product) {
      throw new NotFoundException(`Mahsulot topilmadi (ID: ${id})`);
    }

    return product;
  }

  // Yangi mahsulot yaratish
  async create(createDto: CreateAdminProductDto) {
    const db = this.readDatabase();
    
    const newProduct = {
      id: Date.now(),
      name: createDto.name,
      category: createDto.category || '',
      weight: createDto.weight,
      packQuantity: createDto.packQuantity,
      price: createDto.price,
      stock: createDto.stock,
      image: createDto.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.products.push(newProduct);
    this.writeDatabase(db);

    return newProduct;
  }

  // Mahsulotni yangilash
  async update(id: string, updateDto: UpdateAdminProductDto) {
    const db = this.readDatabase();
    const index = db.products.findIndex((p: any) => p.id === parseInt(id));

    if (index === -1) {
      throw new NotFoundException(`Mahsulot topilmadi (ID: ${id})`);
    }

    db.products[index] = {
      ...db.products[index],
      ...updateDto,
      updatedAt: new Date().toISOString(),
    };

    this.writeDatabase(db);
    return db.products[index];
  }

  // Mahsulotni o'chirish
  async remove(id: string) {
    const db = this.readDatabase();
    const index = db.products.findIndex((p: any) => p.id === parseInt(id));

    if (index === -1) {
      throw new NotFoundException(`Mahsulot topilmadi (ID: ${id})`);
    }

    const deleted = db.products.splice(index, 1);
    this.writeDatabase(db);

    return deleted[0];
  }

  // Mahsulotlarni qidirish
  async search(query: string) {
    const db = this.readDatabase();
    const products = db.products || [];

    return products.filter((p: any) => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Statistika
  async getStats() {
    const db = this.readDatabase();
    const products = db.products || [];
    
    const totalStock = products.reduce((sum: number, p: any) => sum + (p.stock || 0), 0);

    return {
      totalProducts: products.length,
      totalStock,
    };
  }
}
