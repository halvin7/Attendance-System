import 'dotenv/config';
import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AttendanceModule } from './attendance.module';
import { Logger } from '@nestjs/common/services/logger.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AttendanceModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.ATTENDANCE_SERVICE_HOST,
      port: Number(process.env.ATTENDANCE_SERVICE_PORT),
    },
  });
  await app.listen();
  Logger.log(
    `Attendance Service listening on TCP ${process.env.ATTENDANCE_SERVICE_PORT}`
  );
}
bootstrap();
