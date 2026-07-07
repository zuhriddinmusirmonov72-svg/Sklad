import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  ValidateNested,
  ArrayMinSize,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemDto } from './create-order-item.dto';

enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  BANK_TRANSFER = 'BANK_TRANSFER',
  ONLINE = 'ONLINE',
}

export class CreateOrderDto {
  @ApiProperty({
    description: 'Customer ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  customerId: string;

  @ApiProperty({
    description: 'Order items',
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiPropertyOptional({
    description: 'Discount amount',
    example: 10,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  discount?: number;

  @ApiPropertyOptional({
    description: 'Tax amount',
    example: 5,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({
    description: 'Shipping cost',
    example: 15,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  shippingCost?: number;

  @ApiPropertyOptional({
    description: 'Payment method',
    enum: PaymentMethod,
    example: 'CASH',
    default: 'CASH',
  })
  @IsEnum(PaymentMethod)
  @IsOptional()
  paymentMethod?: string;

  @ApiPropertyOptional({
    description: 'Shipping address',
    example: '123 Main Street, Apt 4B',
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiPropertyOptional({
    description: 'Order notes',
    example: 'Please deliver before 5 PM',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
