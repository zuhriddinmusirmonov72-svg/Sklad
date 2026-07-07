import {
  Controller,
  Get,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Qidiruv')
@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('global')
  @ApiOperation({ summary: 'Global search across products, customers, and orders' })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'laptop' })
  globalSearch(@Query('q') query: string) {
    return this.searchService.globalSearch(query);
  }

  @Get('products')
  @ApiOperation({ summary: 'Search products' })
  @ApiResponse({ status: 200, description: 'Products found successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'laptop' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  searchProducts(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchProducts(query, limit);
  }

  @Get('customers')
  @ApiOperation({ summary: 'Search customers' })
  @ApiResponse({ status: 200, description: 'Customers found successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'John' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  searchCustomers(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchCustomers(query, limit);
  }

  @Get('orders')
  @ApiOperation({ summary: 'Search orders' })
  @ApiResponse({ status: 200, description: 'Orders found successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'ORD-' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  searchOrders(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.searchService.searchOrders(query, limit);
  }

  @Get('autocomplete/products')
  @ApiOperation({ summary: 'Autocomplete products' })
  @ApiResponse({ status: 200, description: 'Product suggestions retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'lap' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
  autocompleteProducts(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.searchService.autocompleteProducts(query, limit);
  }

  @Get('autocomplete/customers')
  @ApiOperation({ summary: 'Autocomplete customers' })
  @ApiResponse({ status: 200, description: 'Customer suggestions retrieved successfully' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'Jo' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 5 })
  autocompleteCustomers(
    @Query('q') query: string,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.searchService.autocompleteCustomers(query, limit);
  }
}
