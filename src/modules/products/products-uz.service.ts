import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductUzDto } from './dto/create-product-uz.dto';
import { UpdateProductUzDto } from './dto/update-product-uz.dto';

@Injectable()
export class ProductsUzService {
  private readonly logger = new Logger(ProductsUzService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createProductUzDto: CreateProductUzDto) {
    const product = await this.prisma.productUz.create({
      data: createProductUzDto,
    });

    this.logger.log(`Mahsulot qo'shildi: ${product.nomi} (${product.id})`);
    return product;
  }

  async findAll() {
    const products = await this.prisma.productUz.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: products,
      total: products.length,
      message: 'Barcha mahsulotlar',
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.productUz.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    return product;
  }

  async update(id: string, updateProductUzDto: UpdateProductUzDto) {
    await this.findOne(id);

    const product = await this.prisma.productUz.update({
      where: { id },
      data: updateProductUzDto,
    });

    this.logger.log(`Mahsulot yangilandi: ${product.nomi} (${product.id})`);
    return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.productUz.delete({
      where: { id },
    });

    this.logger.log(`Mahsulot o'chirildi: ${id}`);
    return { 
      message: 'Mahsulot muvaffaqiyatli o\'chirildi',
      success: true 
    };
  }

  async search(query: string) {
    const products = await this.prisma.productUz.findMany({
      where: {
        nomi: {
          contains: query,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: products,
      total: products.length,
      query,
    };
  }
}
