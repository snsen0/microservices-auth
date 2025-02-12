import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


// Postgres bağlantısı için gerekli olan modülü ekliyoruz.
@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DATABASE_HOST,
            url: process.env.DATABASE_URL,
            port: 5432,
            database: process.env.DATABASE_NAME,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            autoLoadEntities: true,
            synchronize: true, // Geliştirme için true, prod için false olmalı
            logging: true,
            schema: 'public',
        }),
    ],
})
export class DatabaseModule {}
