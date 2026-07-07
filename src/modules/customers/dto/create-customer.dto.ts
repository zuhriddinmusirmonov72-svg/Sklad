import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({
    description: 'Customer full name',
    example: 'John Doe',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @ApiProperty({
    description: 'Customer phone number',
    example: '+998901234567',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im, {
    message: 'Phone number is not valid',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Customer email address',
    example: 'john@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    description: 'Customer address',
    example: '123 Main Street',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'Tashkent',
  })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '100000',
  })
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Additional notes about customer',
    example: 'VIP customer',
  })
  @IsString()
  @IsOptional()
  notes?: string;
}
