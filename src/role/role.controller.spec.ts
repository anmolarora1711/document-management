import { Test, TestingModule } from '@nestjs/testing';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';

describe('RoleController', () => {
    let roleController: RoleController;
    let roleService: RoleService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [RoleController],
            providers: [
                {
                    provide: RoleService,
                    useValue: {
                        createRole: jest.fn().mockResolvedValue({ id: 1, name: 'admin' }),
                        findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'admin' }]),
                        updateRole: jest.fn().mockResolvedValue({ id: 1, name: 'editor' }),
                        deleteRole: jest.fn().mockResolvedValue({ message: 'Role deleted successfully' }),
                        assignRoleToUser: jest.fn().mockResolvedValue({ message: 'Role assigned to user' }),
                        removeRoleFromUser: jest.fn().mockResolvedValue({ message: 'Role removed from user' }),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({})
            .overrideGuard(RolesGuard)
            .useValue({})
            .compile();

        roleController = module.get<RoleController>(RoleController);
        roleService = module.get<RoleService>(RoleService);
    });

    describe('createRole', () => {
        it('should create a role', async () => {
            await expect(roleController.createRole({ name: 'admin' })).resolves.toEqual({ id: 1, name: 'admin' });
            expect(roleService.createRole).toHaveBeenCalledWith('admin');
        });

        it('should throw ForbiddenException if role name is missing', async () => {
            await expect(roleController.createRole({ name: '' })).rejects.toThrow('Role name is required.');
        });
    });

    describe('getAllRoles', () => {
        it('should return all roles', async () => {
            await expect(roleController.getAllRoles()).resolves.toEqual([{ id: 1, name: 'admin' }]);
            expect(roleService.findAll).toHaveBeenCalled();
        });
    });

    describe('updateRole', () => {
        it('should update a role', async () => {
            await expect(roleController.updateRole('1', { name: 'editor' })).resolves.toEqual({ id: 1, name: 'editor' });
            expect(roleService.updateRole).toHaveBeenCalledWith(1, 'editor');
        });

        it('should throw an error for invalid role id', async () => {
            await expect(roleController.updateRole('abc', { name: 'editor' })).rejects.toThrow('id should be number');
        });
    });

    describe('deleteRole', () => {
        it('should delete a role', async () => {
            await expect(roleController.deleteRole('1')).resolves.toEqual({ message: 'Role deleted successfully' });
            expect(roleService.deleteRole).toHaveBeenCalledWith(1);
        });

        it('should throw an error for invalid role id', async () => {
            await expect(roleController.deleteRole('abc')).rejects.toThrow('id should be number');
        });
    });

    describe('assignRoleToUser', () => {
        it('should assign a role to a user', async () => {
            await expect(roleController.assignRoleToUser('1', '2')).resolves.toEqual({ message: 'Role assigned to user' });
            expect(roleService.assignRoleToUser).toHaveBeenCalledWith(2, 1);
        });

        it('should throw an error for invalid userId or roleId', async () => {
            await expect(roleController.assignRoleToUser('abc', '2')).rejects.toThrow('userId and roleId should be number');
        });
    });

    describe('removeRoleFromUser', () => {
        it('should remove a role from a user', async () => {
            await expect(roleController.removeRoleFromUser('1', '2')).resolves.toEqual({ message: 'Role removed from user' });
            expect(roleService.removeRoleFromUser).toHaveBeenCalledWith(2, 1);
        });

        it('should throw an error for invalid userId or roleId', async () => {
            await expect(roleController.removeRoleFromUser('abc', '2')).rejects.toThrow('userId and roleId should be number');
        });
    });
});
