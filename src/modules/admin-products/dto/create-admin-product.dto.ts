import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateAdminProductDto {
  @ApiProperty({
    description: 'Nomi (majburiy)',
    example: 'Coca Cola',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Kategoriya (majburiy emas)',
    example: 'Ichimliklar',
    required: false,
  })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Grammi (majburiy)',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  weight: number;

  @ApiProperty({
    description: 'Quti ichida nechta? (majburiy)',
    example: 24,
  })
  @IsNumber()
  @Min(1)
  packQuantity: number;

  @ApiProperty({
    description: 'Narx (USD)',
    example: 12,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Sklad miqdori',
    example: 1000,
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Rasm URL (faqat URL)',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  image: string;
}
