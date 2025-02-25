import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from 'src/auth/dto/sendEmail.dto';
import { LoggerService } from 'src/shared/logger.service';

/**
 * EmailController, e-posta gönderme işlemlerini yöneten API uç noktalarını (endpoint) içerir.
 * Kullanıcıdan gelen HTTP isteklerini alır (POST /email/send ve POST /email/send-temp-password)
 * İlgili işlemleri yapması için email.service.ts'e yönlendirir.
 * Başarılı veya başarısız sonuçları döndürerek yanıt oluşturur.
 */

@ApiTags('email') // Swagger'da "Email" başlığı altında listelenecek
@Controller('email') // Bu controller '/email' endpoint'ine yanıt verir.
export class EmailController {
  constructor(
    private readonly emailService: EmailService,
    private readonly logger: LoggerService,
  ) {}

  /**
   * 📩 Genel e-posta gönderme
   *
   * Kullanıcının belirttiği e-posta adresine bir e-posta gönderir.
   */

  @Post('send')
  @ApiOperation({
    summary: 'E-posta gönder',
    description: 'Belirtilen e-posta adresine bir e-posta gönderir.',
  })
  @ApiResponse({ status: 201, description: 'E-posta başarıyla gönderildi.' })
  @ApiResponse({ status: 400, description: 'Geçersiz veri formatı.' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası.' })
  async sendEmail(@Body() sendEmailDto: SendEmailDto) {
    // E-posta gönderme işlemi
    try {
      this.logger.log(
        `📩 API'ye e-posta gönderme isteği geldi: ${JSON.stringify(sendEmailDto)}`,
      );

      const response = await this.emailService.sendEmail(sendEmailDto);

      this.logger.log(
        `✅ API: E-posta başarıyla gönderildi: ${sendEmailDto.to}`,
      );
      return response;
    } catch (error) {
      this.logger.error(`❌ API: E-posta gönderme hatası: ${error.message}`);
      throw new BadRequestException('E-posta gönderilemedi.');
    }
  }

  /**
   * 🔑 Kullanıcıya geçici şifre gönderme endpoint'i
   *
   * Kullanıcının e-posta adresine rastgele bir geçici şifre gönderir.
   */
  @Post('send-temp-password')
  @ApiOperation({
    summary: 'Geçici şifre gönder',
    description:
      'Belirtilen kullanıcıya geçici bir şifre gönderir ve veritabanını günceller.',
  })
  @ApiResponse({
    status: 201,
    description: 'Geçici şifre başarıyla gönderildi.',
  })
  @ApiResponse({ status: 404, description: 'Kullanıcı bulunamadı.' })
  @ApiResponse({ status: 500, description: 'Sunucu hatası.' })
  async sendTempPassword(@Body('email') email: string) {
    try {
      this.logger.log(`🔑 API'ye geçici şifre gönderme isteği geldi: ${email}`);

      const response = await this.emailService.sendTemporaryPassword(email);

      this.logger.log(`✅ API: Geçici şifre başarıyla gönderildi: ${email}`);
      return response;
    } catch (error) {
      this.logger.error(
        `❌ API: Geçici şifre gönderme hatası: ${error.message}`,
      );
      throw new BadRequestException('Geçici şifre gönderilemedi.');
    }
  }
}
