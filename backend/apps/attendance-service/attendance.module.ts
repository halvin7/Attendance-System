import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../../src/shared/entities/attendance.entity';
import { Employee } from '../../src/shared/entities/employee.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { databaseConfig } from '../../src/shared/entities/database.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig([Attendance, Employee])),
    TypeOrmModule.forFeature([Attendance]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
