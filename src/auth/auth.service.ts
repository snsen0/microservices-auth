import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { HashService } from 'src/shared/hash.service';


// Şifre hashleme ve token oluşturma işlemleri için AuthService sınıfını oluşturduk.

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService,
                private userService:UserService,
                private hashService:HashService,
    ) {} // JwtService sınıfını kullanabilmek için constructor içerisinde tanımladık.

    // Şifre hashleme işlemi
    async hashPassword(password: string): Promise<string> {
        return await this.hashService.hashPassword(password);
        // const salt = await bcrypt.genSalt(10);
        // return await bcrypt.hash(password, salt);
    }

    // Şifre karşılaştırma işlemi
    async comparePassword(newPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(newPassword, hashedPassword);
    }

    // Token oluşturma işlemi
    async generateJwtToken(userId: number, email: string) {
        return this.jwtService.sign({sub: userId, email});
    }

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.userService.findByEmail(email);
        if (user && user.password === password) {
            // Şifre kontrolü başarılı
            return user;
        }
        // Kullanıcı bulunamadı veya şifre yanlış
        return null;
    } 
}
