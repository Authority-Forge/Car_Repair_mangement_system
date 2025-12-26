import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
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
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateProfile(userId: number, updateDto: any): Promise<{
        id: number;
        email: string;
        role: "Mechanic" | "Advisor" | "Customer" | "Admin";
        fullName: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    private generateToken;
}
