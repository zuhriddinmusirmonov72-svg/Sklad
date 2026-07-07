import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminOrdersService } from './admin-orders.service';
import { CreateAdminOrderDto } from './dto/create-admin-order.dto';
import { UpdateAdminOrderDto } from './dto/update-admin-order.dto';

@ApiTags('3. Mijoz Buyurtmalari')
@Controller('admin-orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Barcha buyurtmalarni olish' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli' })
  findAll() {
    return this.adminOrdersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta buyurtmani olish' })
  @ApiResponse({ status: 200, description: 'Buyurtma topildi' })
  @ApiResponse({ status: 404, description: 'Buyurtma topilmadi' })
  findOne(@Param('id') id: string) {
    return this.adminOrdersService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Yangi buyurtma qo\'shish' })
  @ApiResponse({ status: 201, description: 'Buyurtma yaratildi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumot' })
  create(@Body() createDto: CreateAdminOrderDto) {
    return this.adminOrdersService.create(createDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Buyurtmani yangilash' })
  @ApiResponse({ status: 200, description: 'Buyurtma yangilandi' })
  @ApiResponse({ status: 404, description: 'Buyurtma topilmadi' })
  update(@Param('id') id: string, @Body() updateDto: UpdateAdminOrderDto) {
    return this.adminOrdersService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Buyurtmani o\'chirish' })
  @ApiResponse({ status: 200, description: 'Buyurtma o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Buyurtma topilmadi' })
  remove(@Param('id') id: string) {
    return this.adminOrdersService.remove(id);
  }
}
