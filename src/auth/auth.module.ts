import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from '../database/repositories/user.repository';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { RoleRepository } from '../database/repositories/role.repository';
import { CustomRedisModule } from '../redis/redis.module';

@Module({
    imports: [
        CustomRedisModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy, UserRepository, RoleRepository],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}