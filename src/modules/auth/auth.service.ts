import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async login(loginDto: LoginDto) {
    // FAQAT admin@gmail.com / admin ishga tushadi
    if (loginDto.email === 'admin@gmail.com' && loginDto.password === 'admin') {
      this.logger.log(`Admin kirdi: ${loginDto.email}`);

      return {
        success: true,
        message: 'Kirish muvaffaqiyatli',
        user: {
          email: 'admin@gmail.com',
          fullName: 'Administrator',
          role: 'ADMIN',
        },
      };
    }

    throw new UnauthorizedException('Noto\'g\'ri email yoki parol');
  }
}
