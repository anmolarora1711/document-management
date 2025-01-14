import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    async login(@Body() body: { username: string; password: string }) {
        return this.authService.login(await this.authService.validateUser(body.username, body.password));
    }

    @Post('register')
    async register(@Body() body: { username: string, password: string, role: string }) {
        return this.authService.register(body.username, body.password, body.role);
    }

    @Post('logout')
    @UseGuards(JwtAuthGuard)
    async logout(@Req() req: any): Promise<{ message: string }> {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
        throw new Error('Token not provided');
        }
        await this.authService.logout(token);
        return { message: 'Logged out successfully' };
    }
}