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
import { UserService } from 'src/user/user.service';

// Kullanıcı giriş ve kayıt işlemleri

@ApiTags('Auth') // Swagger belgelerindeki grup adı
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService, // Kullanıcı işlemleri için UserService eklendi
  ) {}

  @Post('register')
  @UsePipes(new ValidationPipe()) // class-validator doğrulamalarını aktif eder
  @ApiBody({ type: RegisterDto }) // Swagger belgelerindeki request body
  async register(@Body() body: RegisterDto) {
    // Kullanıcı kayıt işlemi
    const hashedPassword = await this.authService.hashPassword(body.password); // Şifre hashleme işlemi

    // Kullanıcı oluşturma işlemi
    const newUser = await this.userService.createUser({
      email: body.email,
      password: hashedPassword,
      name: body.name,
      phone: body.phone,
    });

    return { message: 'User registered', user: newUser };
  }

  @Post('login')
  @ApiBody({ type: LoginDto }) // Swagger belgelerindeki request body
  @UsePipes(new ValidationPipe()) // class-validator doğrulamalarını aktif eder
  async login(@Body() body: { email: string; password: string }) {
    // Şifre doğrulama ve token oluşturma işlemi
    return { token: await this.authService.generateJwtToken(1, body.email) };
  }
}
