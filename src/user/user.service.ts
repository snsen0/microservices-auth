import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { LoggerService } from 'src/shared/logger.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly logger: LoggerService,
  ) {} // User entity'sine erişebilmek için constructor içerisinde tanımladık.

  /**
   * 📌 Email adresine göre kullanıcıyı getirir.
   * @param email Kullanıcının email adresi
   * @returns Kullanıcı bilgisi
   */

  async findByEmail(email: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase(); // E-postayı normalize et

    this.logger.log(`🔍 Kullanıcı aranıyor: ${normalizedEmail}`);

    // Kullanıcıyı veritabanında ara
    const user = await this.userRepository.findOne({
        where: { email: normalizedEmail }
    });

    if (!user) {
        this.logger.error(`❌ Kullanıcı bulunamadı: ${normalizedEmail}`);
        throw new NotFoundException(`Kullanıcı bulunamadı: ${normalizedEmail}`);
    }

    this.logger.log(`✅ Kullanıcı bulundu: ${user.id}, Email: ${user.email}`);

    return user;
}
  /**
   * 📌 Yeni kullanıcı oluşturur.
   * @param userData Kullanıcı bilgileri
   * @returns Yeni oluşturulan kullanıcı
   */

  async createUser(userData: Partial<User>): Promise<User> {
    // Yeni bir kullanıcı oluşturur
    this.logger.log(
      `📩 Yeni kullanıcı oluşturuluyor: ${JSON.stringify(userData)}`,
    );

    const newUser = this.userRepository.create(userData); // Yeni kullanıcı oluşturur
    await this.userRepository.save(newUser); // Yeni kullanıcıyı veritabanına kaydeder

    this.logger.log(
      `✅ Yeni kullanıcı oluşturuldu: ${JSON.stringify(newUser)}`,
    );
    return newUser;
  }

  /**
   * 📌 Kullanıcı bilgilerini günceller.
   * @param userId Kullanıcının ID'si
   * @param updateData Güncellenecek veriler
   * @returns Güncellenmiş kullanıcı bilgisi
   */

  async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
    // Kullanıcı bilgilerini günceller
    const user = await this.userRepository.preload({
      id: userId,
      ...updateData,
    });

    if (!user) {
      this.logger.error(`❌ Kullanıcı bulunamadı: ID ${userId}`);
      throw new NotFoundException(`Kullanıcı bulunamadı: ID ${userId}`);
    }

    // Object.assign(user, updateData);
    const updatedUser = await this.userRepository.save(user);
    this.logger.log(`✅ Kullanıcı güncellendi: ${JSON.stringify(updatedUser)}`);

    return updatedUser;
  }

  /**
   * 📌 Kullanıcıyı ID'ye göre siler.
   * @param userId Kullanıcının ID'si
   * @returns Silme işleminin sonucu
   */

  async deleteUser(userId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      this.logger.error(`❌ Kullanıcı bulunamadı: ID ${userId}`);
      throw new NotFoundException(`Kullanıcı bulunamadı: ID ${userId}`);
    }

    await this.userRepository.delete(userId);
    this.logger.log(`🗑️ Kullanıcı silindi: ID ${userId}`);
  }
}
