import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../database/repositories/role.repository';
import { Role } from '../database/entities/role.entity';

@Injectable()
export class RoleService {
  constructor(private readonly roleRepository: RoleRepository) {}

  async createRole(name: string): Promise<Role> {
    return this.roleRepository.createRole(name);
  }
}
