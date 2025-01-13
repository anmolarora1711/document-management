import { Injectable } from '@nestjs/common';
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
}