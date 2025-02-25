import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { SharedModule } from 'src/shared/shared.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [SharedModule, UserModule],
  providers: [EmailService],
  controllers: [EmailController],
  exports: [EmailService],
})
export class EmailModule {}
