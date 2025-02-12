import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // Global hata yakalamak için

  // Mikroservis ayarları
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'Ms_queue',
      queueOptions: {
        durable: false
      },
    },
  })

  // Swagger dokümantasyonu
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('NestJS API Documentation')
    .setVersion('1.0')
    .addBearerAuth() // JWT Token ile kimlik doğrulama ekler
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // http://localhost:3000/api adresinde Swagger dokümantasyonu oluşturur

  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(`Ms is running on: ${await app.getUrl()}`);
}

bootstrap();
