import { Controller, Post, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @Roles('admin')
  async createRole(@Body() body: { name: string }) {
    if (!body.name) {
        throw new ForbiddenException('Role name is required.');
    }
    return this.roleService.createRole(body.name);
  }
}
