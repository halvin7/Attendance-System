import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { EmployeeController } from './employee.controller';
import { AttendanceController } from './attendance.controller';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { RolesGuard } from './common/roles.guard';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST,
          port: Number(process.env.AUTH_SERVICE_PORT),
        },
      },
      {
        name: 'ATTENDANCE_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.ATTENDANCE_SERVICE_HOST,
          port: Number(process.env.ATTENDANCE_SERVICE_PORT),
        },
      },
    ]),

    JwtModule.register({
      secret: process.env.JWT_SECRET || 'change-this-secret-for-local-demo',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController, EmployeeController, AttendanceController],
  providers: [JwtAuthGuard, RolesGuard],
})
export class AppModule {}
