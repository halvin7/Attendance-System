import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Employee } from './employee.entity';

@Entity('attendances')
@Unique('uq_employee_attendance_date', ['employeeId', 'attendanceDate'])
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_id' })
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: string;

  @Column({ name: 'check_in_at', type: 'datetime', nullable: true })
  checkInAt: Date | null;

  @Column({
    name: 'check_in_photo',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  checkInPhoto: string | null;

  @Column({ name: 'check_out_at', type: 'datetime', nullable: true })
  checkOutAt: Date | null;

  @Column({ nullable: true, type: 'varchar', length: 500 })
  notes: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
