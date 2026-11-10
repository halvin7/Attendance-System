import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthModule } from './auth.module';
import { Logger } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST,
      port: Number(process.env.AUTH_SERVICE_PORT),
    },
  });
  await app.listen();
  Logger.log(`Auth Service listening on TCP ${process.env.AUTH_SERVICE_PORT}`);
}
bootstrap();
