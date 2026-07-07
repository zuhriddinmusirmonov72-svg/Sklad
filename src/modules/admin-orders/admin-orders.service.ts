import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';
import { UpdateAdminOrderDto } from './dto/update-admin-order.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AdminOrdersService {
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

  // Barcha buyurtmalar
  async findAll() {
    const db = this.readDatabase();
    return db.orders || [];
  }

  // Bitta buyurtma
  async findOne(id: string) {
    const db = this.readDatabase();
    const order = db.orders.find((o: any) => o.id === parseInt(id));

    if (!order) {
      throw new NotFoundException(`Buyurtma topilmadi (ID: ${id})`);
    }

    return order;
  }

  // Yangi buyurtma yaratish
  async create(createDto: CreateAdminOrderDto) {
    const db = this.readDatabase();
    
    const orderNumber = `#ORD-${String(db.orders.length + 1).padStart(3, '0')}`;
    
    const newOrder = {
      id: Date.now(),
      orderNumber,
      customer: createDto.customer,
      phone: createDto.phone || '',
      date: new Date().toISOString(),
      status: createDto.status || "Jo'natilmagan",
      warehouse: createDto.warehouse || 'Склад',
      address: createDto.address || '',
      comment: createDto.comment || '',
      currency: createDto.currency || 'USD',
      lines: createDto.lines || [],
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    this.writeDatabase(db);

    return newOrder;
  }

  // Buyurtmani yangilash
  async update(id: string, updateDto: UpdateAdminOrderDto) {
    const db = this.readDatabase();
    const index = db.orders.findIndex((o: any) => o.id === parseInt(id));

    if (index === -1) {
      throw new NotFoundException(`Buyurtma topilmadi (ID: ${id})`);
    }

    db.orders[index] = {
      ...db.orders[index],
      ...updateDto,
      updatedAt: new Date().toISOString(),
    };

    this.writeDatabase(db);
    return db.orders[index];
  }

  // Buyurtmani o'chirish
  async remove(id: string) {
    const db = this.readDatabase();
    const index = db.orders.findIndex((o: any) => o.id === parseInt(id));

    if (index === -1) {
      throw new NotFoundException(`Buyurtma topilmadi (ID: ${id})`);
    }

    const deleted = db.orders.splice(index, 1);
    this.writeDatabase(db);

    return deleted[0];
  }
}
