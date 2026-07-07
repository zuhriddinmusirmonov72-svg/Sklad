import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const now = new Date();
    const startOfToday = new Date(now.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      todaySales,
      monthlySales,
      totalProducts,
      activeProducts,
      lowStockProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      todayOrders,
    ] = await Promise.all([
      // Today's sales
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfToday },
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Monthly sales
      this.prisma.order.aggregate({
        where: {
          createdAt: { gte: startOfMonth },
          status: { notIn: ['CANCELLED', 'REFUNDED'] },
        },
        _sum: { total: true },
        _count: true,
      }),
      // Total products
      this.prisma.product.count(),
      // Active products
      this.prisma.product.count({ where: { isActive: true } }),
      // Low stock products
      this.prisma.product.count({
        where: {
          stockQuantity: { lte: this.prisma.product.fields.minStockLevel },
        },
      }),
      // Total customers
      this.prisma.customer.count({ where: { isActive: true } }),
      // Total orders
      this.prisma.order.count(),
      // Pending orders
      this.prisma.order.count({ where: { status: 'PENDING' } }),
      // Today's orders
      this.prisma.order.count({ where: { createdAt: { gte: startOfToday } } }),
    ]);

    return {
      sales: {
        today: {
          amount: todaySales._sum.total || 0,
          count: todaySales._count || 0,
        },
        monthly: {
          amount: monthlySales._sum.total || 0,
          count: monthlySales._count || 0,
        },
      },
      products: {
        total: totalProducts,
        active: activeProducts,
        lowStock: lowStockProducts,
      },
      customers: {
        total: totalCustomers,
      },
      orders: {
        total: totalOrders,
        pending: pendingOrders,
        today: todayOrders,
      },
    };
  }

  async getSalesChart(days: number = 7) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const orders = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: startDate, lte: endDate },
        status: { notIn: ['CANCELLED', 'REFUNDED'] },
      },
      select: {
        createdAt: true,
        total: true,
      },
    });

    // Group by date
    const chartData: Record<string, { date: string; sales: number; orders: number }> = {};

    for (let i = 0; i < days; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      chartData[dateStr] = { date: dateStr, sales: 0, orders: 0 };
    }

    orders.forEach((order) => {
      const dateStr = order.createdAt.toISOString().split('T')[0];
      if (chartData[dateStr]) {
        chartData[dateStr].sales += order.total;
        chartData[dateStr].orders += 1;
      }
    });

    return Object.values(chartData);
  }

  async getTopProducts(limit: number = 10) {
    const products = await this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: { totalSold: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        sku: true,
        price: true,
        totalSold: true,
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

  async getRecentOrders(limit: number = 10) {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        customer: {
          select: {
            fullName: true,
            phone: true,
          },
        },
        items: {
          select: {
            quantity: true,
            productName: true,
          },
        },
      },
    });

    return orders;
  }

  async getLowStockProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: this.prisma.product.fields.minStockLevel,
        },
      },
      orderBy: { stockQuantity: 'asc' },
      select: {
        id: true,
        name: true,
        sku: true,
        stockQuantity: true,
        minStockLevel: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return products;
  }
}
