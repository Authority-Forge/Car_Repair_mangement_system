import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { LoginSchema } from './dto/login.dto';

describe('AuthService', () => {
    let service: AuthService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        sign: jest.fn(() => 'test_token'),
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    // AUTH-001: Validate Login input with strict Zod schema
    it('AUTH-001: should validate correct input', () => {
        const validInput = {
            email: 'test@example.com',
            password: 'password123',
            role: 'Mechanic' as const,
        };
        const result = LoginSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });

    // AUTH-002: Handle invalid Login data gracefully
    it('AUTH-002: should fail validation for invalid email', () => {
        const invalidInput = {
            email: 'not-an-email',
            password: 'password123',
            role: 'Mechanic',
        };
        const result = LoginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error.errors[0].message).toBe('Invalid email address');
        }
    });

    it('AUTH-002: should fail validation for short password', () => {
        const invalidInput = {
            email: 'test@example.com',
            password: 'short',
            role: 'Mechanic',
        };
        const result = LoginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('AUTH-002: should fail validation for invalid role', () => {
        const invalidInput = {
            email: 'test@example.com',
            password: 'password123',
            role: 'Hacker',
        };
        const result = LoginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });

    it('should return token on success login', async () => {
        // Mock validateUser behavior in service or stub it
        // The service.login method calls jwtService.sign
        const result = await service.login({ email: 'test@example.com', password: 'password', role: 'Mechanic' });
        expect(result).toHaveProperty('access_token');
        expect(result.access_token).toBe('test_token');
    });
});
