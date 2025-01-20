import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health-check')
  healthCheck(): any {
    return this.appService.getHealthCheck();
  }
}
