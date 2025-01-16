import { Injectable } from '@nestjs/common';
import { RoleRepository } from '../database/repositories/role.repository';
import { Role } from '../database/entities/role.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userService: UserService,
  ) {}

  async createRole(name: string): Promise<Role> {
    return this.roleRepository.createRole(name);
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async updateRole(id: number, name: string) {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new Error('Role not found');
    }
    role.name = name;
    return this.roleRepository.save(role);
  }

  async deleteRole(id: number) {
    const role = await this.roleRepository.findOne({ where: { id: id } });
    if (!role) {
      throw new Error('Role not found');
    }
    await this.roleRepository.remove(role);
    return { message: 'Role deleted successfully' };
  }

  async assignRoleToUser(userId: number, roleId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new Error('Role not found');
    }

    user.role = role;
    await this.userService.save(user);
    return { message: 'Role assigned to user' };
  }

  async removeRoleFromUser(userId: number, roleId: number) {
    const user = await this.userService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.role = null;
    await this.userService.save(user);
    return { message: 'Role removed from user' };
  }
}
