import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RoleRepository } from 'src/database/repositories/role.repository';
import { User } from '../database/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private jwtService: JwtService,
    ) {}

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userRepository.findByUsername(username);
        if (user && await bcrypt.compare(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        throw new UnauthorizedException('Invalid credentials');
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id, role: user.role.name };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async register(username: string, password: string, role: string): Promise<User> {
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new ConflictException('Username already exists');
        }
        const roleFound = await this.roleRepository.findByName(role);
        if (!roleFound) {
            throw new BadRequestException(`Role "${role}" does not exist`);
        }
        const user = new User();
        user.username = username;
        user.password = password;
        user.role = roleFound;

        return await this.userRepository.save(user);
    }
}