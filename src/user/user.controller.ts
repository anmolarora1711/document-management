import { Controller, Get, Body, Post, Delete, UseGuards, Query, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../common/guards/roles.guard';
import { UserService } from './user.service';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @Roles('admin')
    async allUsers(@Query('roleId') roleId?: string) {
        if (roleId) {
            if (isNaN(parseInt(roleId))) {
                throw new Error('role id should be number');
            }
            return this.userService.findUsersByRole(parseInt(roleId));
        }
        return this.userService.findAll();
    }

    @Get(':id')
    @Roles('admin')
    async getUserById(@Param('id') id: string) {
        if (isNaN(parseInt(id))) {
            throw new Error('user id should be number');
        }
        return this.userService.findById(parseInt(id));
    }

    @Delete(':id')
    @Roles('admin')
    async deleteUser(@Param('id') id: number) {
        return this.userService.deleteUser(id);
    }
}