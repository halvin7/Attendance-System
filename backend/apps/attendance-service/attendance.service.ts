import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from '../../src/shared/entities/attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance) private readonly repo: Repository<Attendance>
  ) {}

  private today(): string {
    const now = new Date();
    const y = now.getFullYear(),
      m = String(now.getMonth() + 1).padStart(2, '0'),
      d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  async checkIn(data: { employeeId: number; photo: string }) {
    const date = this.today();
    const existing = await this.repo.findOne({
      where: { employeeId: data.employeeId, attendanceDate: date },
    });
    if (existing)
      throw new BadRequestException('Anda sudah melakukan check-in hari ini.');
    const record = this.repo.create({
      employeeId: data.employeeId,
      attendanceDate: date,
      checkInAt: new Date(),
      checkInPhoto: data.photo,
      checkOutAt: null,
      notes: null,
    });
    return this.repo.save(record);
  }

  async checkOut(employeeId: number) {
    const record = await this.repo.findOne({
      where: { employeeId, attendanceDate: this.today() },
    });
    if (!record)
      throw new BadRequestException('Silakan check-in terlebih dahulu.');
    if (record.checkOutAt)
      throw new BadRequestException('Anda sudah melakukan check-out hari ini.');
    record.checkOutAt = new Date();
    return this.repo.save(record);
  }

  mine(employeeId: number) {
    return this.repo.find({
      where: { employeeId },
      order: { attendanceDate: 'DESC' },
    });
  }

  list() {
    return this.repo.find({
      relations: ['employee'],
      order: { attendanceDate: 'DESC', checkInAt: 'DESC' },
    });
  }
}
