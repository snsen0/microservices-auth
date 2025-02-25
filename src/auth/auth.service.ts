import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/shared/hash.service';
import { LoggerService } from 'src/shared/logger.service';

/**
 * AuthService, kimlik doğrulama ve güvenlik işlemlerini yöneten servistir.
 * Şifre hashleme, şifre doğrulama, JWT token oluşturma ve kullanıcı doğrulama gibi işlemleri içerir.
 */

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private hashService: HashService,
    private readonly logger: LoggerService,
  ) {} // JwtService sınıfını kullanabilmek için constructor içerisinde tanımladık.

  // Token oluşturma işlemi
  async generateJwtToken(userId: number, email: string) {
    return this.jwtService.sign({ sub: userId, email });
  }

  // Kullanıcı doğrulama işlemi
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.error(
        `E-posta adresine ${email} sahip kullanıcı bulunamadı!`,
      );
      return null;
    }
    const isPasswordValid = await this.hashService.comparePassword(password, user.password);
    this.logger.log(`Şifre doğrulama sonucu: ${isPasswordValid}`);
    return isPasswordValid ? user : null; // Eğer şifre doğruysa kullanıcıyı döndür
  }
}
