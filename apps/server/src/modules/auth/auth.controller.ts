import { Controller, Post, Body, UsePipes, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateProfileDto, UpdateProfileSchema } from './dto/update-profile.dto';
import { PasswordResetRequestDto, PasswordResetRequestSchema, PasswordResetDto, PasswordResetSchema } from './dto/password-reset.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @UsePipes(new ZodValidationPipe(LoginSchema))
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @UsePipes(new ZodValidationPipe(RegisterSchema))
    async register(@Body() registerDto: RegisterDto) {
        // AuthService.register will return the same shape as login (token + user info)
        // Ideally we might return just 201 Created or the token to auto-login.
        // The mock service implementation returns logic response.
        return this.authService.register(registerDto);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async getMe(@Req() req: any) {
        return this.authService.getProfile(req.user.userId);
    }

    @Patch('profile')
    @UseGuards(JwtAuthGuard)
    @UsePipes(new ZodValidationPipe(UpdateProfileSchema))
    async updateProfile(@Req() req: any, @Body() updateDto: UpdateProfileDto) {
        return this.authService.updateProfile(req.user.userId, updateDto);
    }

    @Post('password-reset/request')
    @UsePipes(new ZodValidationPipe(PasswordResetRequestSchema))
    async requestPasswordReset(@Body() dto: PasswordResetRequestDto) {
        return this.authService.requestPasswordReset(dto);
    }

    @Post('password-reset/reset')
    @UsePipes(new ZodValidationPipe(PasswordResetSchema))
    async resetPassword(@Body() dto: PasswordResetDto) {
        return this.authService.resetPassword(dto);
    }
}
