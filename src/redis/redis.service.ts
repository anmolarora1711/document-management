import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly redisClient: Redis) {}

  async set(key: string, value: string, expirationInSeconds?: number): Promise<void> {
    if (expirationInSeconds) {
      await this.redisClient.set(key, value, 'EX', expirationInSeconds);
    } else {
      await this.redisClient.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async addToBlacklist(token: string, expirationInSeconds: number): Promise<void> {
    await this.set(token, 'blacklisted', expirationInSeconds);
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const result = await this.get(token);
    return result === 'blacklisted';
  }
}
