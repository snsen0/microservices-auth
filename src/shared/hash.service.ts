import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

// Şifre hashleme ve karşılaştırma işlemlerini burada yapıyoruz
@Injectable()
export class HashService {
    private readonly saltRounds = 10; // Güvenlik için kaç tur hashleme yapılacağını belirler

    async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, this.saltRounds);
    }

    async comparePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }
}