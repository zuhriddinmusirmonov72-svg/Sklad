import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';

export class CreateOrderLineDto {
  @ApiProperty({ description: 'Mahsulot ID', example: 'uuid-123' })
  @IsString()
  productId: string;

  @ApiProperty({ description: 'Mahsulot nomi', example: 'Coca Cola' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Rasm URL', example: 'https://...', required: false })
  @IsString()
  image?: string;

  @ApiProperty({ description: 'Miqdori', example: 10 })
  @IsNumber()
  @Min(1)
  qty: number;

  @ApiProperty({ description: 'Narxi', example: 12 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ description: 'Chegirma', example: 0, default: 0 })
  @IsNumber()
  @Min(0)
  discount?: number;
}
