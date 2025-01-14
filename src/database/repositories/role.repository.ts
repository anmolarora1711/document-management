import { Injectable, ConflictException } from '@nestjs/common';
import { Role } from '../entities/role.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RoleRepository extends Repository<Role> {
    constructor(private dataSource: DataSource) {
        super(Role, dataSource.createEntityManager());
    }

    async findByName(name: string): Promise<Role | null> {
        return this.findOne({ where: { name } });
    }

    async createRole(name: string): Promise<Role> {
        const existingRole = await this.findOne({ where: { name } });
        if (existingRole) {
            throw new ConflictException(`Role "${name}" already exists`);
        }
        const role = new Role();
        role.name = name;
        return this.save(role);
    }
}