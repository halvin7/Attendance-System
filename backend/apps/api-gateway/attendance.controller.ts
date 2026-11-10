import {
  Controller,
  Get,
  Inject,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClientProxy } from '@nestjs/microservices';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { firstValueFrom } from 'rxjs';
import { CurrentUser } from './common/current-user.decorator';
import { JwtAuthGuard } from './common/jwt-auth.guard';
import { Roles } from './common/roles.decorator';
import { RolesGuard } from './common/roles.guard';

@Controller('attendance')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AttendanceController {
  constructor(
    @Inject('ATTENDANCE_SERVICE') private readonly attendance: ClientProxy
  ) {}

  @Post('check-in')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: join(process.cwd(), 'uploads'),
        filename: (_req, file, cb) =>
          cb(
            null,
            `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname).toLowerCase()}`
          ),
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype))
          return cb(
            new BadRequestException('Format foto harus JPG, PNG, atau WEBP.'),
            false
          );
        cb(null, true);
      },
    })
  )
  async checkIn(
    @UploadedFile() photo: Express.Multer.File,
    @CurrentUser() user: any
  ) {
    if (!photo)
      throw new BadRequestException('Foto bukti kerja wajib di-upload.');
    return firstValueFrom(
      this.attendance.send('attendance.checkin', {
        employeeId: user.sub,
        photo: `/uploads/${photo.filename}`,
      })
    );
  }

  @Post('check-out')
  checkOut(@CurrentUser() user: any) {
    return firstValueFrom(
      this.attendance.send('attendance.checkout', { employeeId: user.sub })
    );
  }

  @Get('me')
  mine(@CurrentUser() user: any) {
    return firstValueFrom(this.attendance.send('attendance.mine', user.sub));
  }

  @Get()
  @Roles('HRD')
  all() {
    return firstValueFrom(this.attendance.send('attendance.list', {}));
  }
}
