import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

/**
 * Şifre hashleme ve karşılaştırma işlemlerini burada yapıyoruz
 * Kullanıcı şifrelerini güvenli bir şekilde hashlemek için bcrypt kullanır.
 * Şifrelerin doğruluğunu kontrol eder.
 */

@Injectable()
export class HashService {
  private readonly saltRounds = 10; // Güvenlik için kaç tur hashleme yapılacağını belirler

  /**
   * 🔐 Şifreyi güvenli bir şekilde hash'ler
   *
   * @param password Hashlenecek şifre
   * @returns Hashed şifre
   */

  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * 🔍 Kullanıcının girdiği şifre ile veritabanındaki hash'lenmiş şifreyi karşılaştırır
   *
   * @param password Kullanıcının girdiği şifre
   * @param hashedPassword Veritabanında saklanan hashlenmiş şifre
   * @returns Doğruluk durumu (true/false)
   */

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * 🔐 Geçici şifre oluşturur
   *  @returns Geçici şifre
   */

  generateTempPassword(): string {
    return crypto.randomBytes(8).toString('hex'); // Rastgele geçici şifre oluşturur
  }
}
