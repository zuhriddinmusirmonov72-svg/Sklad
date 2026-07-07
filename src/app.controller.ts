import { Controller, Get, Render } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Sog\'liqni Tekshirish')
@Controller()
export class AppController {
  @Get()
  @Public()
  @ApiOperation({ summary: 'API Welcome & Health Check' })
  @ApiResponse({ 
    status: 200, 
    description: 'API welcome page with system information',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Welcome to E-Commerce Management System API' },
        version: { type: 'string', example: '1.0.0' },
        status: { type: 'string', example: 'operational' },
        timestamp: { type: 'string', example: '2026-07-06T15:30:00.000Z' },
        documentation: { type: 'string', example: '/api/docs' },
        endpoints: { 
          type: 'object',
          properties: {
            health: { type: 'string', example: '/health' },
            swagger: { type: 'string', example: '/api/docs' },
            api: { type: 'string', example: '/api/v1' },
          }
        },
        features: {
          type: 'array',
          items: { type: 'string' },
          example: ['Authentication', 'Products', 'Orders', 'Customers', 'Dashboard']
        }
      }
    }
  })
  getWelcome() {
    return {
      message: '🏪 Welcome to E-Commerce Management System API',
      version: '1.0.0',
      status: 'operational',
      timestamp: new Date().toISOString(),
      documentation: '/api/docs',
      endpoints: {
        health: '/health',
        swagger: '/api/docs',
        api: '/api/v1',
      },
      features: [
        '🔐 JWT Authentication',
        '📦 Product Management',
        '🛒 Order Processing',
        '👥 Customer Management',
        '📊 Dashboard Analytics',
        '📤 File Upload',
        '🔍 Advanced Search',
      ],
      database: {
        status: 'connected',
        type: 'SQLite',
        tables: ['users', 'customers', 'products', 'orders', 'categories', 'payments', 'settings'],
      },
      support: {
        email: 'support@ecommerce.com',
        documentation: 'http://localhost:3000/api/docs',
      }
    };
  }

  @Get('health')
  @Public()
  @ApiOperation({ summary: 'Detailed Health Check' })
  @ApiResponse({ 
    status: 200, 
    description: 'Detailed system health status',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'healthy' },
        uptime: { type: 'number', example: 12345 },
        timestamp: { type: 'string' },
        database: { type: 'string', example: 'connected' },
        memory: {
          type: 'object',
          properties: {
            used: { type: 'number', example: 45 },
            total: { type: 'number', example: 128 },
            unit: { type: 'string', example: 'MB' }
          }
        }
      }
    }
  })
  getHealth() {
    const memoryUsage = process.memoryUsage();
    return {
      status: 'healthy',
      uptime: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
      database: 'connected',
      memory: {
        used: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        total: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        unit: 'MB',
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
    };
  }
}
