import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post('create')
  @UseGuards(AuthGuard('jwt')) // Ensure this route is protected
  async createRole(@Body() body: { name: string }) {
    return this.roleService.createRole(body.name);
  }
}
