import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { CustomRedisModule } from './redis/redis.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    RoleModule,
    CustomRedisModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
