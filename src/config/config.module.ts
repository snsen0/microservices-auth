import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 📌 .env dosyasını okuyup konfigürasyonu yükler
    NestConfigModule.forRoot({ 
      isGlobal: true, // Modülün tüm uygulamada kullanılmasını sağlar
    }),
  ],
})
export class ConfigModule {}
