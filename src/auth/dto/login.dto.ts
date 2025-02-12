import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'test@example.com', description: 'Kullanıcının e-posta adresi'})
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password', description: 'Kullanıcının şifresi'})
    @IsString()
    password: string;
}