import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

// Kullanıcı giriş ve kayıt işlemleri

@ApiTags('Auth') // Swagger belgelerindeki grup adı
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe()) // class-validator doğrulamalarını aktif eder
  @ApiBody({ type: RegisterDto }) // Swagger belgelerindeki request body
  async register(@Body() body: { email: string; password: string }) {
    // Kullanıcı kayıt işlemi
    const hashedPassword = await this.authService.hashPassword(body.password); // Şifre hashleme işlemi
    return { message: 'User registered', hashedPassword };
  }

  @Post('login')
  @ApiBody({ type: LoginDto }) // Swagger belgelerindeki request body
  @UsePipes(new ValidationPipe()) // class-validator doğrulamalarını aktif eder
  async login(@Body() body: { email: string; password: string }) {
    // Şifre doğrulama ve token oluşturma işlemi
    return { token: await this.authService.generateJwtToken(1, body.email) };
  }
}
