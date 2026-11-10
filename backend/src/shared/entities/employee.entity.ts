import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EmployeeRole = 'HRD' | 'EMPLOYEE';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'employee_code', unique: true, length: 30 })
  employeeCode: string;

  @Column({ name: 'full_name', length: 120 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ length: 100 })
  department: string;

  @Column({ length: 100 })
  position: string;

  @Column({ name: 'password_hash', length: 255, select: false })
  passwordHash: string;

  @Column({ type: 'enum', enum: ['HRD', 'EMPLOYEE'], default: 'EMPLOYEE' })
  role: EmployeeRole;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
