import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { PasswordResetRequestDto, PasswordResetDto } from './dto/password-reset.dto';
export declare class AuthService {
    private jwtService;
    private db;
    constructor(jwtService: JwtService, db: PostgresJsDatabase<typeof schema>);
    validateUser(email: string, pass: string): Promise<any>;
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
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        role: "Mechanic" | "Advisor" | "Customer" | "Admin";
        fullName: string;
        resetToken: string;
        resetTokenExpires: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: number, updateDto: any): Promise<{
        id: number;
        email: string;
        role: "Mechanic" | "Advisor" | "Customer" | "Admin";
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
    private generateToken;
}
