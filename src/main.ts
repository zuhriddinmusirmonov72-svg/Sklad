import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // Get configuration
  const port = configService.get<number>('app.port', 3000);
  const apiPrefix = configService.get<string>('app.apiPrefix', 'api/v1');
  const corsOrigin = configService.get<string>('app.corsOrigin', '*');

  // Security
  app.use(helmet());
  app.use(compression());

  // CORS configuration
  app.enableCors({
    origin: corsOrigin.split(',').map((origin) => origin.trim()),
    credentials: true,
  });

  // Global API prefix
  app.setGlobalPrefix(apiPrefix);

  // Static files for uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Admin Panel API')
    .setDescription('Mahsulot va Buyurtmalarni Boshqarish')
    .setVersion('3.0.0') // YANGI VERSIYA - cache tozalash uchun
    .addTag('1. Kirish', 'Login: admin@gmail.com / admin')
    .addTag('2. Mahsulotlar', 'Mahsulotlarni boshqarish')
    .addTag('3. Mijoz Buyurtmalari', 'Buyurtmalarni ko\'rish')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  // Start server on all network interfaces
  await app.listen(port, '0.0.0.0');

  // Get local IP address
  const networkInterfaces = require('os').networkInterfaces();
  let localIP = 'localhost';
  
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      // Skip internal and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        localIP = net.address;
        break;
      }
    }
  }

  logger.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   🚀 Admin Panel API - O'zbekcha                             ║
║                                                               ║
║   📍 Local:         http://localhost:${port}                      ║
║   🌐 Network:       http://${localIP}:${port}              ║
║   📚 Swagger:       http://${localIP}:${port}/api/docs        ║
║   🔐 Environment:   ${configService.get('app.nodeEnv')}                        ║
║   ✨ Status:        Running                                  ║
║                                                               ║
║   📦 APIlar:                                                  ║
║   • GET/POST/PATCH/DELETE /admin-products                     ║
║   • GET/POST/PATCH/DELETE /admin-orders                       ║
║   • POST /upload/single                                       ║
║   • POST /auth/login                                          ║
║                                                               ║
║   💡 Wi-Fi orqali: Network linkidan foydalaning               ║
║   🌍 Internet orqali: Ngrok tunnel ishga tushiring            ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
  `);
}

bootstrap();
