import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Employee } from './shared/entities/employee.entity';
import { databaseConfig } from './shared/entities/database.config';

async function seed() {
  const dataSource = new DataSource({
    ...databaseConfig([Employee]),
  });
  await dataSource.initialize();
  const repo = dataSource.getRepository(Employee);
  const users = [
    {
      employeeCode: 'HRD001',
      fullName: 'Admin HR',
      email: 'adminHR@demo.com',
      department: 'Human Resources',
      position: 'HR Admin',
      role: 'HRD' as const,
      password: 'HRAdmin123!',
    },
    {
      employeeCode: 'EMP001',
      fullName: 'Super Employee',
      email: 'emp123@demo.com',
      department: 'Engineering',
      position: 'Software Engineer',
      role: 'EMPLOYEE' as const,
      password: 'SoftEng123!',
    },
  ];
  for (const user of users) {
    const exists = await repo.findOne({ where: { email: user.email } });
    if (!exists)
      await repo.save(
        repo.create({
          employeeCode: user.employeeCode,
          fullName: user.fullName,
          email: user.email,
          department: user.department,
          position: user.position,
          role: user.role,
          passwordHash: await bcrypt.hash(user.password, 10),
          isActive: true,
        })
      );
  }
  console.log('Demo users are ready.');
  await dataSource.destroy();
}
seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
