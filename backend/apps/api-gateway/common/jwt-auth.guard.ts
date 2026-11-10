import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const header = request.headers.authorization || '';
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token)
      throw new UnauthorizedException('Token tidak ditemukan.');

    try {
      request.user = this.jwt.verify(token);
      return true;
    } catch {
      throw new UnauthorizedException(
        'Token tidak valid atau sudah kedaluwarsa.'
      );
    }
  }
}
