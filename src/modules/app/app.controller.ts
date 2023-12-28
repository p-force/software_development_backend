import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { LoggerInterceptor } from '../../common/modules/logger/logger.interceptor';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Application')
@UseInterceptors(LoggerInterceptor)
@Controller()
export class AppController {
  @Get('')
  getHello(): string {
    return `Version: ${process.env.npm_package_version} `;
  }
}
