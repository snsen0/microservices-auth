import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/shared/hash.service';
import { EmailService } from 'src/email/email.service';

/**
* AuthController, Kimlik doğrulama ile ilgili HTTP isteklerini yöneten denetleyicidir.
* Kullanıcı giriş ve kayıt işlemleri 
* */


@ApiTags('Auth') // Swagger belgelerindeki grup adı
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userService: UserService, // Kullanıcı işlemleri için UserService eklendi
    private hashService: HashService, // HashService sınıfı eklendi
    private emailService: EmailService, // EmailService sınıfı
  ) {}

  @Post('register')
  @ApiOperation({
      summary: 'Kullanıcıyı kaydet',
      description: 'Kullanıcının email, name ve phone bilgilerini ile beraber üye mailine random şifre göndererek şifre ile diğer bilgileri de veritabanına kayıt eder.',
    })
  @UsePipes(new ValidationPipe()) // class-validator doğrulamalarını aktif eder
  @ApiBody({ type: RegisterDto }) // Swagger belgelerindeki request body
  async register(@Body() registerDto: RegisterDto) {
    const { email, name, phone } = registerDto;
    const normalizedEmail = email.trim().toLowerCase();

    // 1️⃣ Kullanıcı zaten var mı kontrol et
    const existingUser = await this.userService.findByEmail(normalizedEmail).catch(() => null);
    if (existingUser) {
      throw new BadRequestException('Bu e-posta adresi zaten kullanılıyor.');
    }

    // 2️⃣ Geçici şifre oluştur
    const tempPassword = this.hashService.generateTempPassword();
    const hashedPassword = await this.hashService.hashPassword(tempPassword);

    // 3️⃣ Kullanıcıyı oluştur ve kaydet
    const newUser = await this.userService.createUser({
      email: normalizedEmail,
      name,
      phone,
      password: hashedPassword, // Şifre hashlenmiş şekilde kaydediliyor
    });

    // 4️⃣ Kullanıcıya geçici şifreyi e-posta ile gönder
    await this.emailService.sendTemporaryPassword(normalizedEmail);

    return {
      message: 'Kullanıcı başarıyla kaydedildi ve geçici şifre gönderildi.',
      userId: newUser.id,
    };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Üye girişi',
    description: 'Üyeler buradan girişini yapar.',
  })
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
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email veya şifre hatalı');
    }

    // JWT token oluştur ve döndür (AuthService'den geliyor)
    const token = await this.authService.generateJwtToken(user.id, user.email);
    return { message: 'Giriş başarılı', token };
  }
}
