import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SendEmailDto } from 'src/auth/dto/sendEmail.dto';
import { LoggerService } from 'src/shared/logger.service';

/**
 * EmailController, e-posta gönderme işlemlerini yöneten API uç noktalarını (endpoint) içerir.
 * Kullanıcıdan gelen HTTP isteklerini alır (POST /email/send)
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
}
