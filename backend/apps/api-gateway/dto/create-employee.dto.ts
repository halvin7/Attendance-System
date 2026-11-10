import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  employeeCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  fullName: string;

  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  department: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  position: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password?: string;

  @IsOptional()
  @IsIn(['HRD', 'EMPLOYEE'])
  role?: 'HRD' | 'EMPLOYEE';

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
