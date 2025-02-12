import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { SharedModule } from 'src/shared/shared.module';


@Module({
  imports: [
    ConfigModule,
    UserModule,
    SharedModule,
    JwtModule.register({ // JwtModule.register metodu ile JwtModule modülünü projemize ekliyoruz.
      secret: process.env.JWT_SECRET, // Secret key'i .env dosyasından alıyoruz.
      signOptions: { expiresIn: '1d' }, // Token'ın geçerlilik süresini 1 gün olarak belirledik.
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
