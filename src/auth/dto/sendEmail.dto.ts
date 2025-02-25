import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SendEmailDto {
  @ApiProperty({
    example: 'test@example.com',
    description: 'Alıcının e-posta adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz' })
  to: string;

  @ApiProperty({ example: 'Subject', description: 'E-posta konusu' })
  @IsString()
  subject: string;

  @ApiProperty({ example: 'Content', description: 'E-posta içeriği' })
  @IsString()
  content: string;
}
