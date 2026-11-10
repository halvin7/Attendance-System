import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttendanceService } from './attendance.service';

@Controller()
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @MessagePattern('attendance.checkin')
  checkIn(@Payload() data: any) {
    return this.service.checkIn(data);
  }

  @MessagePattern('attendance.checkout')
  checkOut(@Payload() data: any) {
    return this.service.checkOut(data.employeeId);
  }

  @MessagePattern('attendance.mine')
  mine(@Payload() employeeId: number) {
    return this.service.mine(employeeId);
  }

  @MessagePattern('attendance.list')
  list() {
    return this.service.list();
  }
}
