import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

// Kullanıcı bilgilerini almak için API endpoint'lerini barındırır

@ApiTags('User') // Swagger belgelerindeki grup adı
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    // Kullanıcıyı email adresine göre bulur
    @Get(':email')
    async getUserByEmail(@Param('email') email: string) { // Parametre olarak email alır
        return await this.userService.findByEmail(email);
    }
}
