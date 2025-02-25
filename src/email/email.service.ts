import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { SendEmailDto } from 'src/auth/dto/sendEmail.dto';
import { HashService } from 'src/shared/hash.service';
import { LoggerService } from 'src/shared/logger.service';
import { UserService } from 'src/user/user.service';


/**
 * EmailService, uygulama içinde e-posta gönderme işlemlerini yöneten servistir.
 * Kullanıcılara e-posta ile bildirimler ve geçici şifreler göndermek için kullanılır.
 * Gerçek e-posta gönderme işlemini gerçekleştirir.
 * E-posta içeriklerini oluşturur ve hazırlar.
 * Geçici şifre oluşturur, hash'ler ve veritabanına kaydeder.
 * Gmail SMTP servisini kullanarak e-posta gönderir.
 */


@Injectable()
export class EmailService {

  /**
   * 📡 E-posta gönderimi için Nodemailer yapılandırması
   * Gmail SMTP servisini kullanarak e-posta gönderimi yapılır.
   */

  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly hashService: HashService,
  ) {}


  /**
   * 📩 Genel e-posta gönderme fonksiyonu
   * Admin veya sistem herhangi bir e-posta gönderebilir.
   */

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

  /**
   * 🔑 Kullanıcıya geçici şifre gönderme fonksiyonu
   * 
   * Kullanıcıya rastgele bir geçici şifre oluşturup e-posta ile gönderir.
   * Hata durumunda, eski şifre geri yüklenir.
   */

  async sendTemporaryPassword(email: string) {
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      this.logger.error('⚠️ E-posta kimlik bilgileri eksik!');
      throw new InternalServerErrorException('E-posta ayarları eksik.');
    } // E-posta kimlik bilgileri eksikse hata ver

    let user; // Kullanıcıyı saklamak için
    let oldPassword: string | null = null; // Kullanıcının önceki şifresini saklamak için

    try {
    // Kullanıcı e-posta adresini al
    const user = await this.userService.findByEmail(email);

    // Eğer kullanıcının şifresi varsa önceki şifreyi sakla
    if (user.password) {
      oldPassword = user.password;
    }

    // Geçici şifre oluştur
    const tempPassword = this.hashService.generateTempPassword();
    this.logger.log(`🔑 Geçici şifre oluşturuldu: ${tempPassword}`);

    // Şifreyi hashleyerek veritabanına kaydet
    const hashedPassword = await this.hashService.hashPassword(tempPassword);
    await this.userService.updateUser(user.id, { password: hashedPassword });

    // E-posta DTO'sunu oluştur
    const sendEmailDto: SendEmailDto = {
      to: user.email,
      subject: 'Geçici Şifreniz',
      content: `Merhaba ${user.name},\n\nGeçici şifreniz: ${tempPassword}\n\nBu şifreyle giriş yapabilirsiniz ve ardından şifrenizi değiştirmeniz önerilir.`,
    };

    // Geçici şifreyi e-posta gönderme işlemi
    await this.sendEmail(sendEmailDto);

    this.logger.log(`✅ Geçici şifre başarıyla gönderildi: ${email}`);
      return { message: 'Geçici şifre başarıyla gönderildi' };
  } catch (error) {
    this.logger.error(`❌ Geçici şifre gönderme hatası: ${error.message}`);

    // Eğer kullanıcının önceki bir şifresi varsa geri yükle
    if (user && oldPassword !== null) {
      await this.userService.updateUser(user.id, { password: oldPassword });
      this.logger.log('🔄 Eski şifre geri yüklendi.');
    }

    throw new InternalServerErrorException('Geçici şifre gönderilemedi.');
  }
  }
}
