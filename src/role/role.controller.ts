import { Controller, Get, Post, Put, Param, Delete, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

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

  @Get()
  @Roles('admin')  // Only admin can access this route
  async getAllRoles() {
    return this.roleService.findAll();
  }

  @Put(':id')
  @Roles('admin')  // Only admin can update roles
  async updateRole(
    @Param('id') id: string, 
    @Body() body: { name: string }
  ) {
    if (isNaN(parseInt(id))) {
      throw new ForbiddenException('id should be number');
    }
    if (!body.name) {
      throw new ForbiddenException('Role name is required.');
    }
    return this.roleService.updateRole(parseInt(id), body.name);
  }

  @Delete(':id')
  @Roles('admin')  // Only admin can delete roles
  async deleteRole(@Param('id') id: string) {
    if (isNaN(parseInt(id))) {
      throw new ForbiddenException('id should be number');
    }
    return this.roleService.deleteRole(parseInt(id));
  }

  @Post('/assign/:userId/:roleId')
  @Roles('admin')  // Only admin can assign roles
  async assignRoleToUser(
    @Param('roleId') roleId: string, 
    @Param('userId') userId: string
  ) {
    if (isNaN(parseInt(userId)) || isNaN(parseInt(roleId))) {
      throw new ForbiddenException('userId and roleId should be number');
    }
    return this.roleService.assignRoleToUser(parseInt(userId), parseInt(roleId));
  }

  @Delete('remove/:userId/:roleId')
  @Roles('admin')  // Only admin can remove roles
  async removeRoleFromUser(
    @Param('roleId') roleId: string, 
    @Param('userId') userId: string
  ) {
    if (isNaN(parseInt(userId)) || isNaN(parseInt(roleId))) {
      throw new ForbiddenException('userId and roleId should be number');
    }
    return this.roleService.removeRoleFromUser(parseInt(userId), parseInt(roleId));
  }
}
