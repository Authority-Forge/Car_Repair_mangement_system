import { Injectable, UnauthorizedException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { DRIZZLE } from '../../database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { eq, and, gt } from 'drizzle-orm';
import { PasswordResetRequestDto, PasswordResetDto } from './dto/password-reset.dto';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        @Inject(DRIZZLE) private db: PostgresJsDatabase<typeof schema>
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, email)
        });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }

    async login(loginDto: LoginDto) {
        // Validation handled by Pipe, but explicit safeParse if needed.

        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, loginDto.email)
        });

        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Ensure role matches?
        if (loginDto.role && user.role !== loginDto.role) {
            throw new UnauthorizedException('Role mismatch');
        }

        return this.generateToken(user);
    }

    async register(registerDto: RegisterDto) {
        // Check duplicate
        const existing = await this.db.query.users.findFirst({ where: eq(schema.users.email, registerDto.email) });
        if (existing) {
            throw new BadRequestException('User already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const [newUser] = await this.db.insert(schema.users).values({
            email: registerDto.email,
            passwordHash: hashedPassword,
            fullName: registerDto.fullName,
            role: registerDto.role,
        }).returning();

        return this.generateToken(newUser);
    }

    async getProfile(userId: number) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.id, userId)
        });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        const { passwordHash, ...result } = user;
        return result;
    }

    async updateProfile(userId: number, updateDto: any) {
        const [updatedUser] = await this.db.update(schema.users)
            .set(updateDto)
            .where(eq(schema.users.id, userId))
            .returning();

        if (!updatedUser) {
            throw new BadRequestException('Failed to update profile');
        }

        const { passwordHash, ...result } = updatedUser;
        return result;
    }

    async requestPasswordReset(dto: PasswordResetRequestDto) {
        const user = await this.db.query.users.findFirst({
            where: eq(schema.users.email, dto.email)
        });

        // Always return success message to prevent enumeration
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1); // 1 hour expiry

            await this.db.update(schema.users)
                .set({ resetToken: token, resetTokenExpires: expires })
                .where(eq(schema.users.id, user.id));

            // In a real app, send email here. For MVP, we log or user mock.
            console.log(`[PASSWORD RESET] Token for ${user.email}: ${token}`);
        }

        return { message: 'If this email exists in our records, a reset link has been sent.' };
    }

    async resetPassword(dto: PasswordResetDto) {
        const user = await this.db.query.users.findFirst({
            where: and(
                eq(schema.users.resetToken, dto.token),
                gt(schema.users.resetTokenExpires, new Date())
            )
        });

        if (!user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        await this.db.update(schema.users)
            .set({
                passwordHash: hashedPassword,
                resetToken: null,
                resetTokenExpires: null
            })
            .where(eq(schema.users.id, user.id));

        return { message: 'Password has been reset successfully.' };
    }

    private generateToken(user: any) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }
}
