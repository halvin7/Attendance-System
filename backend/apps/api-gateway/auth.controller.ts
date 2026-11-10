import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject('AUTH_SERVICE') private readonly auth: ClientProxy,
    private readonly jwt: JwtService
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    const employee = await firstValueFrom(this.auth.send('auth.login', body));
    const payload = {
      sub: employee.id,
      email: employee.email,
      role: employee.role,
      fullName: employee.fullName,
    };
    return { accessToken: this.jwt.sign(payload), user: employee };
  }
}
