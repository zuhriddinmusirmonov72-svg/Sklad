import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderLineDto } from './create-order-line.dto';

export class CreateAdminOrderDto {
  @ApiProperty({ description: 'Mijoz nomi', example: 'Samar' })
  @IsString()
  customer: string;

  @ApiProperty({ description: 'Telefon', example: '+998901234567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Status', example: "Jo'natilmagan", default: "Jo'natilmagan" })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ description: 'Sklad', example: 'Склад', default: 'Склад' })
  @IsString()
  @IsOptional()
  warehouse?: string;

  @ApiProperty({ description: 'Manzil', required: false })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({ description: 'Izoh', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ description: 'Valyuta', example: 'USD', default: 'USD' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ 
    description: 'Buyurtma mahsulotlari',
    type: [CreateOrderLineDto],
    example: [{
      productId: '123',
      name: 'Coca Cola',
      image: 'https://...',
      qty: 10,
      price: 12,
      discount: 0
    }]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderLineDto)
  lines: CreateOrderLineDto[];
}
