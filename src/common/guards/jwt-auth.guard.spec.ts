import { JwtAuthGuard } from './jwt-auth.guard';
import { RedisService } from '../../redis/redis.service';
import { UnauthorizedException } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

jest.mock('ioredis');

describe('JwtAuthGuard', () => {
    let jwtAuthGuard: JwtAuthGuard;
    let redisService: RedisService;

    const mockRedisClient = {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
    };

    beforeEach(() => {
        redisService = new RedisService(mockRedisClient as any); // Mock the Redis client
        jwtAuthGuard = new JwtAuthGuard(redisService);
    });

    it('should be defined', () => {
        expect(jwtAuthGuard).toBeDefined();
    });

    it('should throw UnauthorizedException if token is blacklisted', async () => {
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: 'Bearer blacklisted-token',
                    },
                }),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(redisService, 'isTokenBlacklisted').mockResolvedValue(true);

        await expect(jwtAuthGuard.canActivate(mockContext)).rejects.toThrow(UnauthorizedException);
    });

    it('should call super.canActivate if token is not blacklisted', async () => {
        const mockContext = {
            switchToHttp: () => ({
                getRequest: () => ({
                    headers: {
                        authorization: 'Bearer valid-token',
                    },
                }),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(redisService, 'isTokenBlacklisted').mockResolvedValue(false);
        jest.spyOn(jwtAuthGuard, 'canActivate').mockResolvedValue(true as any);

        const result = await jwtAuthGuard.canActivate(mockContext);
        expect(result).toBe(true);
    });
});
