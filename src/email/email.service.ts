import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from 'src/auth/dto/sendEmail.dto';
import { LoggerService } from 'src/shared/logger.service';

// Geçici şifre gönderme işlemi

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  constructor(private readonly logger: LoggerService) {}

  async sendEmail(sendEmailDto: SendEmailDto) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      this.logger.error('⚠️ E-posta kimlik bilgileri eksik!');
      throw new InternalServerErrorException('E-posta ayarları eksik.');
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: sendEmailDto.to,
      subject: sendEmailDto.subject,
      text: sendEmailDto.content,
    };

    try {
      this.logger.log(
        `📩 E-posta gönderme isteği alındı: ${JSON.stringify(sendEmailDto)}`,
      );
      await this.transporter.sendMail(mailOptions); // Mail gönderme işlemi
      this.logger.log(`📩 E-posta başarıyla gönderildi: ${sendEmailDto.to}`);
      return { message: 'E-posta başarıyla gönderildi' };
    } catch (error) {
      this.logger.error(`❌ E-posta gönderme hatası: ${error.message}`);
      throw new InternalServerErrorException('E-posta gönderilemedi.');
    }
  }
}
