import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductsUzService } from './products-uz.service';
import { ProductsUzController } from './products-uz.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProductsController, ProductsUzController],
  providers: [ProductsService, ProductsUzService],
  exports: [ProductsService, ProductsUzService],
})
export class ProductsModule {}
