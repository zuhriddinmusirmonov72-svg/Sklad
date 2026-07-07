import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { calculatePagination, createPaginatedResult } from '../../common/utils/pagination.util';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    // Check if phone already exists
    const existing = await this.prisma.customer.findUnique({
      where: { phone: createCustomerDto.phone },
    });

    if (existing) {
      throw new ConflictException('Customer with this phone number already exists');
    }

    // Check if email exists (if provided)
    if (createCustomerDto.email) {
      const existingEmail = await this.prisma.customer.findFirst({
        where: { email: createCustomerDto.email },
      });

      if (existingEmail) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    const customer = await this.prisma.customer.create({
      data: createCustomerDto,
    });

    this.logger.log(`Customer created: ${customer.fullName} (${customer.id})`);
    return customer;
  }

  async findAll(filterDto: FilterCustomerDto) {
    const { skip, take } = calculatePagination(filterDto);

    const where: any = {};

    if (filterDto.search) {
      where.OR = [
        { fullName: { contains: filterDto.search } },
        { phone: { contains: filterDto.search } },
        { email: { contains: filterDto.search } },
      ];
    }

    if (filterDto.city) {
      where.city = { contains: filterDto.city };
    }

    if (filterDto.isActive !== undefined) {
      where.isActive = filterDto.isActive;
    }

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip,
        take,
        orderBy: filterDto.sortBy
          ? { [filterDto.sortBy]: filterDto.sortOrder || 'desc' }
          : { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return createPaginatedResult(customers, total, filterDto);
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        _count: {
          select: { orders: true },
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async getCustomerHistory(id: string) {
    await this.findOne(id);

    const orders = await this.prisma.order.findMany({
      where: { customerId: id },
      include: {
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
      orderBy: { createdAt: 'desc' },
    });

    return {
      customerId: id,
      orders,
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
    };
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    // Check phone uniqueness if being updated
    if (updateCustomerDto.phone) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          AND: [{ phone: updateCustomerDto.phone }, { id: { not: id } }],
        },
      });

      if (existing) {
        throw new ConflictException('Customer with this phone number already exists');
      }
    }

    // Check email uniqueness if being updated
    if (updateCustomerDto.email) {
      const existing = await this.prisma.customer.findFirst({
        where: {
          AND: [{ email: updateCustomerDto.email }, { id: { not: id } }],
        },
      });

      if (existing) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    const customer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
    });

    this.logger.log(`Customer updated: ${customer.fullName} (${customer.id})`);
    return customer;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if customer has orders
    const ordersCount = await this.prisma.order.count({
      where: { customerId: id },
    });

    if (ordersCount > 0) {
      throw new ConflictException(
        `Cannot delete customer with ${ordersCount} orders. Archive the customer instead.`,
      );
    }

    await this.prisma.customer.delete({
      where: { id },
    });

    this.logger.log(`Customer deleted: ${id}`);
    return { message: 'Customer deleted successfully' };
  }
}
