import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginSchema } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

// Mock DB for now or inject Drizzle Service later
// For the purpose of "Login Feature" we will implement the logic.

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService) { }

    async validateUser(email: string, pass: string): Promise<any> {
        // In a real app, this would query the DB
        // const user = await db.select().from(users).where(eq(users.email, email));

        // MOCK DATA for initial dev (User AUTH-001 tests will mock this service method anyway)
        // We can assume we have a findByEmail method helper

        // Placeholder implementation to allow Controller compilation:
        if (email === 'test@example.com' && pass === 'password') {
            const { password, ...result } = { id: 1, email, role: 'Mechanic', password: 'password' };
            return result;
        }

        return null;
    }

    async login(loginDto: LoginDto) {
        // Validate again just in case (though Controller does it via Pipe)
        const validation = LoginSchema.safeParse(loginDto);
        if (!validation.success) {
            throw new Error('Validation failed'); // Should be caught by Pipe
        }

        // Logic to verify user
        // In real flow: validateUser is called by LocalStrategy usually, OR we do it manually here.
        // Let's do manual for simplicity with DTO

        // Note: In production we'd look up the user by email, compare hash.
        // For this MVP step 1: 
        // const user = await this.findByEmail(loginDto.email);
        // const isMatch = await bcrypt.compare(loginDto.password, user.passwordHash);

        // Returning dummy JWT
        const payload = { email: loginDto.email, sub: 1, role: loginDto.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                email: loginDto.email,
                role: loginDto.role
            }
        };
    }
}
