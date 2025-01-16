import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // Find a user by their unique ID
    async findOne(userId: number): Promise<User> {
        return this.userRepository.findOne({ where: { id: userId }, relations: ['role'] });
    }

    // Find a user by their username
    async findByUsername(username: string): Promise<User> {
        return this.userRepository.findOne({ where: { username }, relations: ['role'] });
    }

    // Save or update a user entity (useful for assigning/removing roles)
    async save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
}
