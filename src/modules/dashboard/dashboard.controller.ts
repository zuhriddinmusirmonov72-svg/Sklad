import { Controller, Get, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@Roles('SUPER_ADMIN', 'ADMIN', 'MANAGER')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getStats() {
    return this.dashboardService.getStats();
  }

  @Get('sales-chart')
  @ApiOperation({ summary: 'Get sales chart data' })
  @ApiResponse({ status: 200, description: 'Sales chart data retrieved successfully' })
  @ApiQuery({ name: 'days', required: false, type: Number, example: 7 })
  getSalesChart(
    @Query('days', new DefaultValuePipe(7), ParseIntPipe) days: number,
  ) {
    return this.dashboardService.getSalesChart(days);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Get top selling products' })
  @ApiResponse({ status: 200, description: 'Top products retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getTopProducts(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getTopProducts(limit);
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Get recent orders' })
  @ApiResponse({ status: 200, description: 'Recent orders retrieved successfully' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  getRecentOrders(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.dashboardService.getRecentOrders(limit);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock products' })
  @ApiResponse({ status: 200, description: 'Low stock products retrieved successfully' })
  getLowStockProducts() {
    return this.dashboardService.getLowStockProducts();
  }
}
