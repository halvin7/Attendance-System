import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../../src/shared/entities/employee.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { databaseConfig } from '../../src/shared/entities/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig([Employee])),
    TypeOrmModule.forFeature([Employee]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
