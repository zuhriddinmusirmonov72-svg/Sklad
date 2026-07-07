import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(private readonly prisma: PrismaService) {}

  async searchProducts(query: string, limit: number = 10) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { sku: { contains: query } },
          { description: { contains: query } },
          { tags: { contains: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        discountPrice: true,
        stockQuantity: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products;
  }

  async searchCustomers(query: string, limit: number = 10) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const customers = await this.prisma.customer.findMany({
      where: {
        isActive: true,
        OR: [
          { fullName: { contains: query } },
          { phone: { contains: query } },
          { email: { contains: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        city: true,
        totalOrders: true,
        totalSpent: true,
      },
    });

    return customers;
  }

  async searchOrders(query: string, limit: number = 10) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const orders = await this.prisma.order.findMany({
      where: {
        OR: [
          { orderNumber: { contains: query } },
          { customer: { fullName: { contains: query } } },
          { customer: { phone: { contains: query } } },
        ],
      },
      take: limit,
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
        customer: {
          select: {
            fullName: true,
            phone: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async autocompleteProducts(query: string, limit: number = 5) {
    if (!query || query.trim().length < 1) {
      return [];
    }

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        stockQuantity: true,
      },
    });

    return products.map((p) => ({
      id: p.id,
      label: `${p.name} (${p.sku})`,
      value: p.id,
      price: p.price,
      stock: p.stockQuantity,
    }));
  }

  async autocompleteCustomers(query: string, limit: number = 5) {
    if (!query || query.trim().length < 1) {
      return [];
    }

    const customers = await this.prisma.customer.findMany({
      where: {
        isActive: true,
        OR: [
          { fullName: { contains: query } },
          { phone: { contains: query } },
        ],
      },
      take: limit,
      select: {
        id: true,
        fullName: true,
        phone: true,
      },
    });

    return customers.map((c) => ({
      id: c.id,
      label: `${c.fullName} (${c.phone})`,
      value: c.id,
    }));
  }

  async globalSearch(query: string) {
    if (!query || query.trim().length < 2) {
      return {
        products: [],
        customers: [],
        orders: [],
      };
    }

    const [products, customers, orders] = await Promise.all([
      this.searchProducts(query, 5),
      this.searchCustomers(query, 5),
      this.searchOrders(query, 5),
    ]);

    return {
      products,
      customers,
      orders,
    };
  }
}
