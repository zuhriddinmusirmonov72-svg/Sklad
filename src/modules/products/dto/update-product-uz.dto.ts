import { PartialType } from '@nestjs/swagger';
import { CreateProductUzDto } from './create-product-uz.dto';

export class UpdateProductUzDto extends PartialType(CreateProductUzDto) {}
