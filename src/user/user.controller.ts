import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
  @ApiOperation({
    summary: 'Kullanıcıyı bul',
    description: 'Kullanıcıyı email adresine göre bulur.',
  })
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

  @Delete(':email')
  @ApiOperation({ summary: 'Belirtilen email’e sahip kullanıcıyı siler' })
  @ApiParam({
    name: 'email',
    required: true,
    description: 'Silinecek kullanıcı email adresi',
  })
  @ApiOkResponse({ description: 'Kullanıcı başarıyla silindi' })
  @ApiNotFoundResponse({ description: 'Kullanıcı bulunamadı' })
  async deleteUserByEmail(
    @Param('email') email: string,
  ): Promise<{ message: string }> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException(`Kullanıcı bulunamadı: ${email}`);
    }

    await this.userService.deleteUserByEmail(email);

    return { message: `Kullanıcı başarıyla silindi: ${email}` };
  }
}
