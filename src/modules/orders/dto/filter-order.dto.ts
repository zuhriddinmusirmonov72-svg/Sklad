import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export class FilterOrderDto extends PaginationDto {
  @ApiPropertyOptional({
    description: 'Search by order number or customer name',
    example: 'ORD-',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by order status',
    enum: OrderStatus,
    example: 'PENDING',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Filter by payment status',
    enum: PaymentStatus,
    example: 'PAID',
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: string;

  @ApiPropertyOptional({
    description: 'Filter by customer ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsOptional()
  customerId?: string;
}
