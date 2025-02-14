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

    async findByEmail(email: string): Promise<User> { // Kullanıcıyı email adresine göre bulur
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            this.logger.error(`User with email ${email} not found`);
            throw new NotFoundException('Kullanıcı bulunamadı.');
        }
        this.logger.log(`✅ Kullanıcı bulundu: ${JSON.stringify(user)}`);
        return user;
    }

    async createUser(userData: Partial<User>): Promise<User> { // Yeni bir kullanıcı oluşturur
        return await this.userRepository.save(userData);
    }
}
