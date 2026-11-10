import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Employee } from '../../src/shared/entities/employee.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Employee)
    private readonly repo: Repository<Employee>
  ) {}

  async login(email: string, password: string) {
    const employee = await this.repo
      .createQueryBuilder('employee')
      .addSelect('employee.passwordHash')
      .where('LOWER(employee.email) = LOWER(:email)', { email })
      .andWhere('employee.isActive = :active', { active: true })
      .getOne();

    if (!employee || !(await bcrypt.compare(password, employee.passwordHash))) {
      throw new RpcException({
        statusCode: 401,
        message: 'Email atau password tidak sesuai.',
      });
    }

    const { passwordHash, ...safeEmployee } = employee;

    return safeEmployee;
  }

  async list() {
    return this.repo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async get(id: number) {
    const employee = await this.repo.findOne({
      where: { id },
    });

    if (!employee) {
      throw new RpcException({
        statusCode: 404,
        message: 'Karyawan tidak ditemukan.',
      });
    }

    return employee;
  }

  async create(data: any) {
    const exists = await this.repo.findOne({
      where: [{ email: data.email }, { employeeCode: data.employeeCode }],
    });

    if (exists) {
      throw new RpcException({
        statusCode: 400,
        message: 'Email atau employee code sudah digunakan.',
      });
    }

    const entity = this.repo.create({
      employeeCode: data.employeeCode,
      fullName: data.fullName,
      email: data.email,
      department: data.department,
      position: data.position,
      passwordHash: await bcrypt.hash(data.password || 'Welcome123!', 10),
      role: data.role || 'EMPLOYEE',
      isActive: data.isActive ?? true,
    });

    const saved = await this.repo.save(entity);
    const { passwordHash, ...safe } = saved;

    return safe;
  }

  async update(id: number, data: any) {
    const employee = await this.get(id);

    Object.assign(employee, {
      employeeCode: data.employeeCode ?? employee.employeeCode,
      fullName: data.fullName ?? employee.fullName,
      email: data.email ?? employee.email,
      department: data.department ?? employee.department,
      position: data.position ?? employee.position,
      role: data.role ?? employee.role,
      isActive: data.isActive ?? employee.isActive,
    });

    const saved = await this.repo.save(employee);
    const { passwordHash, ...safe } = saved;

    return safe;
  }

  async remove(id: number) {
    const employee = await this.get(id);

    employee.isActive = false;
    await this.repo.save(employee);

    return {
      message: 'Karyawan berhasil dinonaktifkan.',
    };
  }
}
