import { Injectable, Logger } from '@nestjs/common';

// LoggerService, @nestjs/common paketindeki Logger sınıfını sarar ve loglama işlemlerini gerçekleştirir.

@Injectable()
export class LoggerService {
  private readonly logger = new Logger(LoggerService.name);

   /**
   * 📢 Bilgilendirme logu kaydeder
   * 
   * @param message Loglanacak mesaj
   */

  log(message: string) {
    this.logger.log(message);
  }

  /**
   * ❌ Hata mesajı kaydeder
   * 
   * @param message Loglanacak hata mesajı
   */

  error(message: string) {
    this.logger.error(message);
  }
}