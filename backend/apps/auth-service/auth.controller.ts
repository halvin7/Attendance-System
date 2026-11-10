import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @MessagePattern('auth.login')
  login(@Payload() data: { email: string; password: string }) {
    return this.service.login(data.email, data.password);
  }

  @MessagePattern('employee.list')
  list() {
    return this.service.list();
  }

  @MessagePattern('employee.create')
  create(@Payload() data: any) {
    return this.service.create(data);
  }

  @MessagePattern('employee.update')
  update(@Payload() data: any) {
    return this.service.update(data.id, data);
  }

  @MessagePattern('employee.delete')
  remove(@Payload() id: number) {
    return this.service.remove(id);
  }

  @MessagePattern('employee.get')
  get(@Payload() id: number) {
    return this.service.get(id);
  }
}
