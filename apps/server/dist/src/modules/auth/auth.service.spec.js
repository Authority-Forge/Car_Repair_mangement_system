"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const auth_service_1 = require("./auth.service");
const jwt_1 = require("@nestjs/jwt");
const login_dto_1 = require("./dto/login.dto");
describe('AuthService', () => {
    let service;
    beforeEach(async () => {
        const module = await testing_1.Test.createTestingModule({
            providers: [
                auth_service_1.AuthService,
                {
                    provide: jwt_1.JwtService,
                    useValue: {
                        sign: jest.fn(() => 'test_token'),
                    },
                },
            ],
        }).compile();
        service = module.get(auth_service_1.AuthService);
    });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('AUTH-001: should validate correct input', () => {
        const validInput = {
            email: 'test@example.com',
            password: 'password123',
            role: 'Mechanic',
        };
        const result = login_dto_1.LoginSchema.safeParse(validInput);
        expect(result.success).toBe(true);
    });
    it('AUTH-002: should fail validation for invalid email', () => {
        const invalidInput = {
            email: 'not-an-email',
            password: 'password123',
            role: 'Mechanic',
        };
        const result = login_dto_1.LoginSchema.safeParse(invalidInput);
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
        const result = login_dto_1.LoginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });
    it('AUTH-002: should fail validation for invalid role', () => {
        const invalidInput = {
            email: 'test@example.com',
            password: 'password123',
            role: 'Hacker',
        };
        const result = login_dto_1.LoginSchema.safeParse(invalidInput);
        expect(result.success).toBe(false);
    });
    it('should return token on success login', async () => {
        const result = await service.login({ email: 'test@example.com', password: 'password', role: 'Mechanic' });
        expect(result).toHaveProperty('access_token');
        expect(result.access_token).toBe('test_token');
    });
});
//# sourceMappingURL=auth.service.spec.js.map