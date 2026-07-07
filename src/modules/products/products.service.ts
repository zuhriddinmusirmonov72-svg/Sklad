import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { calculatePagination, createPaginatedResult } from '../../common/utils/pagination.util';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto, createdBy: string) {
    // Check if SKU already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });

    if (existingProduct) {
      throw new ConflictException(`Product with SKU ${createProductDto.sku} already exists`);
    }

    const slug = generateSlug(createProductDto.name);

    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug,
        createdBy,
      },
      include: {
        category: true,
        images: true,
      },
    });

    this.logger.log(`Product created: ${product.id}`);
    return product;
  }

  async findAll(filterDto: FilterProductDto) {
    const { skip, take } = calculatePagination(filterDto);
    const { search, categoryId, isActive, isFeatured, minPrice, maxPrice, lowStock } = filterDto;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (lowStock) {
      where.stockQuantity = { lte: this.prisma.product.fields.minStockLevel };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          images: {
            orderBy: {
              sortOrder: 'asc',
            },
          },
          _count: {
            select: {
              orderItems: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return createPaginatedResult(products, total, filterDto);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
        creator: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Increment view count
    await this.prisma.product.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async findBySku(sku: string) {
    return this.prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        images: true,
      },
    });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    // If SKU is being updated, check for conflicts
    if (updateProductDto.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: {
          sku: updateProductDto.sku,
          NOT: { id },
        },
      });

      if (existingProduct) {
        throw new ConflictException(`Product with SKU ${updateProductDto.sku} already exists`);
      }
    }

    const data: any = { ...updateProductDto };

    // Update slug if name changed
    if (updateProductDto.name) {
      data.slug = generateSlug(updateProductDto.name);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
      },
    });

    this.logger.log(`Product updated: ${product.id}`);
    return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if product has orders
    const orderCount = await this.prisma.orderItem.count({
      where: { productId: id },
    });

    if (orderCount > 0) {
      throw new ConflictException(
        `Cannot delete product with existing orders. Please deactivate instead.`,
      );
    }

    await this.prisma.product.delete({
      where: { id },
    });

    this.logger.log(`Product deleted: ${id}`);
    return { message: 'Product successfully deleted' };
  }

  async updateStock(id: string, quantity: number) {
    const product = await this.findOne(id);

    const newStock = product.stockQuantity + quantity;

    if (newStock < 0) {
      throw new ConflictException('Insufficient stock');
    }

    return this.prisma.product.update({
      where: { id },
      data: { stockQuantity: newStock },
    });
  }

  async getLowStockProducts() {
    return this.prisma.product.findMany({
      where: {
        isActive: true,
        stockQuantity: {
          lte: this.prisma.product.fields.minStockLevel,
        },
      },
      include: {
        category: true,
      },
      orderBy: {
        stockQuantity: 'asc',
      },
    });
  }
}
