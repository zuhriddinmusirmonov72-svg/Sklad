import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const slug = this.generateSlug(createCategoryDto.name);

    // Check if category with same name or slug exists
    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: createCategoryDto.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name already exists');
    }

    const category = await this.prisma.category.create({
      data: {
        ...createCategoryDto,
        slug,
      },
    });

    this.logger.log(`Category created: ${category.name} (${category.id})`);
    return category;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return {
      data: categories,
      total: categories.length,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);

    // If name is being updated, generate new slug
    const updateData: any = { ...updateCategoryDto };
    if (updateCategoryDto.name) {
      updateData.slug = this.generateSlug(updateCategoryDto.name);

      // Check if new name/slug conflicts with another category
      const existing = await this.prisma.category.findFirst({
        where: {
          AND: [
            { id: { not: id } },
            {
              OR: [{ name: updateCategoryDto.name }, { slug: updateData.slug }],
            },
          ],
        },
      });

      if (existing) {
        throw new ConflictException('Category with this name already exists');
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: updateData,
    });

    this.logger.log(`Category updated: ${category.name} (${category.id})`);
    return category;
  }

  async remove(id: string) {
    await this.findOne(id);

    // Check if category has products
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new ConflictException(
        `Cannot delete category with ${productsCount} products. Move or delete products first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    this.logger.log(`Category deleted: ${id}`);
    return { message: 'Category deleted successfully' };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
