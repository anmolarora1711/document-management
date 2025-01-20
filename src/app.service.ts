import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealthCheck(): any {
    return { status: 'UP', timestamp: new Date() };
  }
}
