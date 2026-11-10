import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { Roles } from './common/roles.decorator';
import { RolesGuard } from './common/roles.guard';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('HRD')
export class EmployeeController {
  constructor(@Inject('AUTH_SERVICE') private readonly auth: ClientProxy) {}

  @Get()
  list() {
    return firstValueFrom(this.auth.send('employee.list', {}));
  }

  @Get(':id')
  get(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(this.auth.send('employee.get', id));
  }

  @Post()
  create(@Body() body: CreateEmployeeDto) {
    return firstValueFrom(this.auth.send('employee.create', body));
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEmployeeDto
  ) {
    return firstValueFrom(this.auth.send('employee.update', { id, ...body }));
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return firstValueFrom(this.auth.send('employee.delete', id));
  }
}
