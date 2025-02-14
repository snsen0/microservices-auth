import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
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
  async login(@Body() body: LoginDto) {
    const { email, password } = body; // Request body'den email ve password alındı

    // Kullanıcıyı email adresine göre bulma işlemi (UserService'den geliyor) (veritabanından çeker)
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // Şifre doğrulama işlemi
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // JWT token oluştur ve döndür (AuthService'den geliyor)
    const token = await this.authService.generateJwtToken(user.id, user.email);
    return { message: 'Giriş başarılı', token };
  }
}
