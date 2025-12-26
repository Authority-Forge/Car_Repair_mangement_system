import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PasswordResetRequestDto, PasswordResetDto } from './dto/password-reset.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            fullName: any;
            role: any;
        };
    }>;
    getMe(req: any): Promise<{
        email: string;
        role: "Mechanic" | "Customer" | "Advisor" | "Admin";
        id: number;
        fullName: string;
        resetToken: string;
        resetTokenExpires: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(req: any, updateDto: UpdateProfileDto): Promise<{
        email: string;
        role: "Mechanic" | "Customer" | "Advisor" | "Admin";
        id: number;
        fullName: string;
        resetToken: string;
        resetTokenExpires: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    requestPasswordReset(dto: PasswordResetRequestDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: PasswordResetDto): Promise<{
        message: string;
    }>;
}
