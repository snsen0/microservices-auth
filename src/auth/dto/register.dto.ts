import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RegisterDto {
    @ApiProperty({ example: 'test@example.com', description: 'Kullanıcının e-posta adresi' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'John Doe', description: 'Kullanıcının adı' })
    @IsString()
    name: string;

    @ApiProperty({ example: '1234567890', description: 'Kullanıcının telefon numarası' })
    @IsString()
    phone: string;

    @ApiProperty({ example: 'password', description: 'Kullanıcının şifresi (en az 6 karakter)' })
    @IsString()
    password: string;
}