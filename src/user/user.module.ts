import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from '../database/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { RoleModule } from 'src/role/role.module';

@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService, UserRepository],
    controllers: [],
    exports: [UserService, UserRepository],
})
export class UserModule {}