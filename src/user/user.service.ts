import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {} // User entity'sine erişebilmek için constructor içerisinde tanımladık.

    async findByEmail(email: string): Promise<User> { // Kullanıcıyı email adresine göre bulur
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async createUser(userData: Partial<User>): Promise<User> { // Yeni bir kullanıcı oluşturur
        return await this.userRepository.save(userData);
    }
}
