import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum } from 'class-validator';

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

export class UpdateOrderDto {
  @ApiPropertyOptional({
    description: 'Order status',
    enum: OrderStatus,
    example: 'CONFIRMED',
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Payment status',
    enum: PaymentStatus,
    example: 'PAID',
  })
  @IsEnum(PaymentStatus)
  @IsOptional()
  paymentStatus?: string;

  @ApiPropertyOptional({
    description: 'Tracking number',
    example: 'TRACK123456',
  })
  @IsString()
  @IsOptional()
  trackingNumber?: string;

  @ApiPropertyOptional({
    description: 'Order notes',
    example: 'Customer requested delivery change',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
