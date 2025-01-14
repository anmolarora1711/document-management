import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RedisService } from '../../redis/redis.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly redisService: RedisService) {
    super();
  }

  async canActivate(context: any): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split(' ')[1];
    if (token && await this.redisService.isTokenBlacklisted(token)) {
      throw new UnauthorizedException('Token is blacklisted.');
    }
    const canActivate = await super.canActivate(context) as boolean;
    return canActivate;
  }
}
