import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../database/entities/user.entity';

describe('UserController', () => {
    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UserService,
                    useValue: {
                        findAll: jest.fn().mockResolvedValue([{} as User]),
                        findUsersByRole: jest.fn().mockResolvedValue([{} as User]),
                        findById: jest.fn().mockResolvedValue({} as User),
                        deleteUser: jest.fn().mockResolvedValue({ message: 'User deleted successfully' }),
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard('jwt'))
            .useValue({})
            .overrideGuard(RolesGuard)
            .useValue({})
            .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    });

    describe('allUsers', () => {
        it('should return all users', async () => {
            await expect(userController.allUsers()).resolves.toEqual([{} as User]);
            expect(userService.findAll).toHaveBeenCalled();
        });

        it('should return users by roleId', async () => {
            await expect(userController.allUsers('1')).resolves.toEqual([{} as User]);
            expect(userService.findUsersByRole).toHaveBeenCalledWith(1);
        });

        it('should throw an error for invalid roleId', async () => {
            await expect(userController.allUsers('abc')).rejects.toThrow('role id should be number');
        });
    });

    describe('getUserById', () => {
        it('should return a user by id', async () => {
            await expect(userController.getUserById('1')).resolves.toEqual({} as User);
            expect(userService.findById).toHaveBeenCalledWith(1);
        });

        it('should throw an error for invalid user id', async () => {
            await expect(userController.getUserById('abc')).rejects.toThrow('user id should be number');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            await expect(userController.deleteUser(1)).resolves.toEqual({ message: 'User deleted successfully' });
            expect(userService.deleteUser).toHaveBeenCalledWith(1);
        });
    });
});
