import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ProductsUzService } from './products-uz.service';
import { CreateProductUzDto } from './dto/create-product-uz.dto';
import { UpdateProductUzDto } from './dto/update-product-uz.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Mahsulotlar (O\'zbek)')
@Controller('products-uz')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ProductsUzController {
  constructor(private readonly productsUzService: ProductsUzService) {}

  @Post()
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Yangi mahsulot qo\'shish' })
  @ApiResponse({ status: 201, description: 'Mahsulot muvaffaqiyatli qo\'shildi' })
  @ApiResponse({ status: 400, description: 'Noto\'g\'ri ma\'lumot' })
  create(@Body() createProductUzDto: CreateProductUzDto) {
    return this.productsUzService.create(createProductUzDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Barcha mahsulotlarni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Mahsulotlar ro\'yxati' })
  findAll() {
    return this.productsUzService.findAll();
  }

  @Get('search')
  @Public()
  @ApiOperation({ summary: 'Mahsulot qidirish' })
  @ApiResponse({ status: 200, description: 'Qidiruv natijalari' })
  @ApiQuery({ name: 'q', required: true, example: 'iPhone' })
  search(@Query('q') query: string) {
    return this.productsUzService.search(query);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Bitta mahsulotni ko\'rish' })
  @ApiResponse({ status: 200, description: 'Mahsulot topildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsUzService.findOne(id);
  }

  @Patch(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @ApiOperation({ summary: 'Mahsulotni tahrirlash' })
  @ApiResponse({ status: 200, description: 'Mahsulot yangilandi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductUzDto: UpdateProductUzDto,
  ) {
    return this.productsUzService.update(id, updateProductUzDto);
  }

  @Delete(':id')
  @Roles('SUPER_ADMIN', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mahsulotni o\'chirish' })
  @ApiResponse({ status: 200, description: 'Mahsulot o\'chirildi' })
  @ApiResponse({ status: 404, description: 'Mahsulot topilmadi' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsUzService.remove(id);
  }
}
