import { RolesGuard } from './roles.guard';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

describe('RolesGuard', () => {
    let guard: RolesGuard;
    let reflector: Reflector;

    beforeEach(() => {
        reflector = new Reflector();
        guard = new RolesGuard(reflector);
    });

    it('should allow access if no roles are required', () => {
        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ user: { role: 'user' } }),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
        expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should allow access if user has a matching role', () => {
        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ user: { role: 'admin' } }),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
        expect(guard.canActivate(mockContext)).toBe(true);
    });

    it('should throw ForbiddenException if user does not have a matching role', () => {
        const mockContext = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnValue({
                getRequest: jest.fn().mockReturnValue({ user: { role: 'user' } }),
            }),
        } as unknown as ExecutionContext;

        jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
        expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
    });
});
