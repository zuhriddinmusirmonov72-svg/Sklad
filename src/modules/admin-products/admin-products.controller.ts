import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';
import { CreateAdminProductDto } from './dto/create-admin-product.dto';
import { UpdateAdminProductDto } from './dto/update-admin-product.dto';

@ApiTags('2. Mahsulotlar')
@Controller('admin-products')
export class AdminProductsController {
  constructor(private readonly adminProductsService: AdminProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha mahsulotlarni olish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli' })
  findAll() {
    return this.adminProductsService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Mahsulotlar statistikasi' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli' })
  getStats() {
    return this.adminProductsService.getStats();
  }

  @Get('search')
  @ApiOperation({ summary: 'Mahsulotlarni qidirish' })
  @ApiQuery({ name: 'q', required: true, description: 'Qidiruv so\'zi' })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari' })
  search(@Query('q') query: string) {
    return this.adminProductsService.search(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta mahsulotni olish' })
  @ApiResponse({ status: 200, description: 'Mahsulot topildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  findOne(@Param('id') id: string) {
    return this.adminProductsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi mahsulot qo\'shish' })
  @ApiResponse({ status: 201, description: 'Mahsulot yaratildi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumot' })
  create(@Body() createDto: CreateAdminProductDto) {
    return this.adminProductsService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mahsulotni yangilash' })
  @ApiResponse({ status: 200, description: 'Mahsulot yangilandi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAdminProductDto) {
    return this.adminProductsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Mahsulotni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Mahsulot o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  remove(@Param('id') id: string) {
    return this.adminProductsService.remove(id);
  }
}
