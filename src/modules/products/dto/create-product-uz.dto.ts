import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive, IsUrl, IsOptional } from 'class-validator';

export class CreateProductUzDto {
  @ApiProperty({
    description: 'Mahsulot nomi (majburiy)',
    example: 'iPhone 15 Pro Max',
  })
  @IsString()
  @IsNotEmpty({ message: 'Nomi kiritilishi shart' })
  nomi: string;

  @ApiProperty({
    description: 'Grammda og\'irligi (majburiy)',
    example: 221,
  })
  @IsNumber()
  @IsPositive({ message: 'Gramm musbat son bo\'lishi kerak' })
  grammm: number;

  @ApiProperty({
    description: 'Quti ichida nechta',
    example: 1,
  })
  @IsNumber()
  @IsPositive()
  qutiIchidaNechta: number;

  @ApiProperty({
    description: 'Narx (USD)',
    example: 1200,
  })
  @IsNumber()
  @IsPositive()
  narxUSD: number;

  @ApiProperty({
    description: 'Narx (UZS - so\'m)',
    example: 15000000,
  })
  @IsNumber()
  @IsPositive()
  narxUZS: number;

  @ApiProperty({
    description: 'Sklad miqdori',
    example: 50,
  })
  @IsNumber()
  @IsPositive()
  skladMiqdori: number;

  @ApiProperty({
    description: 'Rasm URL (internetdan)',
    example: 'https://example.com/iphone15.jpg',
  })
  @IsUrl({}, { message: 'To\'g\'ri URL kiriting' })
  @IsString()
  rasmUrl: string;

  @ApiProperty({
    description: 'Qo\'shimcha ma\'lumot (ixtiyoriy)',
    example: 'Yangi model, 256GB xotira',
    required: false,
  })
  @IsString()
  @IsOptional()
  tavsif?: string;
}
