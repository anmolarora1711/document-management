import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from 'src/database/repositories/user.repository';
import { RoleRepository } from 'src/database/repositories/role.repository';
import { User } from '../database/entities/user.entity';
import { RedisService } from 'src/redis/redis.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userRepository: UserRepository,
        private roleRepository: RoleRepository,
        private readonly jwtService: JwtService,
        private readonly redisService: RedisService,
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

        const savedUser = await this.userRepository.save(user);
        delete savedUser.password;
        return savedUser;
    }

  async logout(token: string): Promise<void> {
    const decoded = this.jwtService.decode(token) as { exp: number };
    if (!decoded || !decoded.exp) {
      throw new Error('Invalid token');
    }

    const expiresIn = decoded.exp * 1000 - Date.now();  // Calculate remaining time in milliseconds
    if (expiresIn > 0) {
      await this.redisService.addToBlacklist(token, Math.floor(expiresIn / 1000));
    }
  }
}