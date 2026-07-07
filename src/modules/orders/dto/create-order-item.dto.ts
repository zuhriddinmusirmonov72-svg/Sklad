import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Quantity',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  quantity: number;

  @ApiPropertyOptional({
    description: 'Discount amount per item',
    example: 5,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;
}
