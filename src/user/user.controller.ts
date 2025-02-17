import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';
import { LoggerService } from 'src/shared/logger.service';

// Kullanıcı bilgilerini almak için API endpoint'lerini barındırır

@ApiTags('User') // Swagger belgelerindeki grup adı
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {}

  // Kullanıcıyı email adresine göre bulur
  @Get(':email')
  async getUserByEmail(@Param('email') email: string) {
    // Parametre olarak email alır
    try {
      // findByEmail servisi ile kullanıcıyı email üzerinden arar
      return await this.userService.findByEmail(email);

    } catch (error) {
      // Hata durumunda uygun bir mesaj döner
      this.logger.error(`❌ Kullanıcı bulunamadı: ${email}`);
      throw new NotFoundException(
        'Kullanıcı bulunamadı veya başka bir hata oluştu.',
      );
    }
  }
}
