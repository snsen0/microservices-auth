import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

// Token doğrulama işlemleri için JwtStrategy sınıfını oluşturduk.
// PassportStrategy sınıfını extend ederek JwtStrategy sınıfını oluşturduk.

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private configService: ConfigService) { // ConfigService sınıfını kullanabilmek için constructor içerisinde tanımladık.
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Token'ın nereden alınacağını belirttik.
            secretOrKey: configService.get<string>('JWT_SECRET'), // JWT_Secret key'i config dosyasından alıyoruz.
        });
    }

    async validate(payload: any) { // Token'ın geçerli olup olmadığını kontrol eden validate fonksiyonunu oluşturduk.
        return { userId: payload.sub, email: payload.email }; // Token geçerli ise userId ve email bilgilerini döndürüyoruz. 
    }
}