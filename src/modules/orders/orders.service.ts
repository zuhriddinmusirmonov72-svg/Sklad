import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { calculatePagination, createPaginatedResult } from '../../common/utils/pagination.util';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto, adminId: string) {
    // Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    // Verify all products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of createOrderDto.items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }

      if (!product.isActive) {
        throw new BadRequestException(`Product ${product.name} is not active`);
      }

      if (product.stockQuantity < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
        );
      }

      const itemDiscount = item.discount || 0;
      const unitPrice = product.discountPrice || product.price;
      const itemTotal = unitPrice * item.quantity - itemDiscount;

      subtotal += itemTotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        quantity: item.quantity,
        unitPrice,
        discount: itemDiscount,
        total: itemTotal,
      });
    }

    // Calculate final total
    const discount = createOrderDto.discount || 0;
    const tax = createOrderDto.tax || 0;
    const shippingCost = createOrderDto.shippingCost || 0;
    const total = subtotal - discount + tax + shippingCost;

    // Generate order number
    const orderNumber = await this.generateOrderNumber();

    // Create order with items in transaction
    const order = await this.prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId: createOrderDto.customerId,
          subtotal,
          discount,
          tax,
          shippingCost,
          total,
          paymentMethod: createOrderDto.paymentMethod || 'CASH',
          shippingAddress: createOrderDto.shippingAddress,
          notes: createOrderDto.notes,
          createdBy: adminId,
          items: {
            create: orderItems,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      // Update product stock and sales count
      for (const item of createOrderDto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { decrement: item.quantity },
            totalSold: { increment: item.quantity },
          },
        });
      }

      // Update customer statistics
      await tx.customer.update({
        where: { id: createOrderDto.customerId },
        data: {
          totalOrders: { increment: 1 },
          totalSpent: { increment: total },
          lastOrderAt: new Date(),
        },
      });

      return newOrder;
    });

    this.logger.log(`Order created: ${order.orderNumber} (${order.id})`);
    return order;
  }

  async findAll(filterDto: FilterOrderDto) {
    const { skip, take } = calculatePagination(filterDto);

    const where: any = {};

    if (filterDto.search) {
      where.OR = [
        { orderNumber: { contains: filterDto.search } },
        { customer: { fullName: { contains: filterDto.search } } },
      ];
    }

    if (filterDto.status) {
      where.status = filterDto.status;
    }

    if (filterDto.paymentStatus) {
      where.paymentStatus = filterDto.paymentStatus;
    }

    if (filterDto.customerId) {
      where.customerId = filterDto.customerId;
    }

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          customer: true,
          items: {
            include: {
              product: {
                select: {
                  name: true,
                  sku: true,
                },
              },
            },
          },
        },
        orderBy: filterDto.sortBy
          ? { [filterDto.sortBy]: filterDto.sortOrder || 'desc' }
          : { createdAt: 'desc' },
      }),
      this.prisma.order.count({ where }),
    ]);

    return createPaginatedResult(orders, total, filterDto);
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    const updateData: any = { ...updateOrderDto };

    // Set timestamps based on status changes
    if (updateOrderDto.status) {
      switch (updateOrderDto.status) {
        case 'CONFIRMED':
          updateData.confirmedAt = new Date();
          break;
        case 'SHIPPED':
          updateData.shippedAt = new Date();
          break;
        case 'DELIVERED':
          updateData.deliveredAt = new Date();
          break;
        case 'CANCELLED':
        case 'REFUNDED':
          updateData.cancelledAt = new Date();
          break;
      }
    }

    const order = await this.prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    this.logger.log(`Order updated: ${order.orderNumber} (${order.id})`);
    return order;
  }

  async remove(id: string) {
    const order = await this.findOne(id);

    if (order.status !== 'PENDING') {
      throw new BadRequestException(
        'Only pending orders can be deleted. Cancel the order instead.',
      );
    }

    // Restore product stock in transaction
    await this.prisma.$transaction(async (tx) => {
      // Restore stock
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stockQuantity: { increment: item.quantity },
            totalSold: { decrement: item.quantity },
          },
        });
      }

      // Update customer stats
      await tx.customer.update({
        where: { id: order.customerId },
        data: {
          totalOrders: { decrement: 1 },
          totalSpent: { decrement: order.total },
        },
      });

      // Delete order
      await tx.order.delete({ where: { id } });
    });

    this.logger.log(`Order deleted: ${order.orderNumber} (${id})`);
    return { message: 'Order deleted successfully' };
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Count today's orders
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = (count + 1).toString().padStart(4, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
  }
}
