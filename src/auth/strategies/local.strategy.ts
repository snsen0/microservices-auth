import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-local';
import { AuthService } from "../auth.service";
import { User } from "src/user/user.entity";

// Kullanıcı girişinde email ve password doğrulaması yapar
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private readonly authService: AuthService) {
        super({usernameField: 'email'}); // email alanını kullanıcı adı olarak belirler
    }

    async validate(email: string, password: string): Promise<User> { // Kullanıcıyı doğrular
        const user = await this.authService.validateUser(email, password);
        if(!user){
            throw new UnauthorizedException('Kullanıcı bulunamadı');
        }
        return user;
    }
}