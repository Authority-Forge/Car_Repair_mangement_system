"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("../src/app.module");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
describe('Session Management (E2E)', () => {
    let app;
    let token;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();
        const loginRes = await (0, supertest_1.default)(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'mech@test.com', password: 'Password123!', role: 'Mechanic' });
        token = loginRes.body.access_token;
    });
    afterAll(async () => {
        await app.close();
    });
    it('AUTH-061: GET /auth/me - Success', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(res => {
            expect(res.body.email).toBe('mech@test.com');
            expect(res.body.role).toBe('Mechanic');
            expect(res.body.passwordHash).toBeUndefined();
        });
    });
    it('AUTH-061: GET /auth/me - Fail (No Token)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/auth/me')
            .expect(401);
    });
    it('AUTH-061: GET /auth/me - Fail (Invalid Token)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer invalid-token`)
            .expect(401);
    });
    describe('Security & Edge Cases', () => {
        it('AUTH-061: No PII leak in profile', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${token}`);
            const bodyStr = JSON.stringify(res.body);
            expect(bodyStr).not.toContain('passwordHash');
            expect(bodyStr).not.toContain('hash');
        });
        it('AUTH-062: PATCH /auth/profile - Success (Valid)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: 'Verified Mechanic' })
                .expect(200);
        });
        it('AUTH-062: PATCH /auth/profile - Fail (Strict Zod)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ something: 'evil', fullName: 'Too Long' })
                .expect(400);
        });
        it('AUTH-062: PATCH /auth/profile - Ignore Immutable Field (role)', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'Admin' })
                .expect(400);
        });
        it('AUTH-062: PATCH /auth/profile - Ignore Immutable Field (id)', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ id: 9999 })
                .expect(400);
        });
        it('AUTH-044: XSS Sanitization check in Profile', async () => {
            const xssPayload = '<script>alert(1)</script>';
            await (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: xssPayload })
                .expect(200);
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${token}`);
            expect(res.body.fullName).toBe(xssPayload);
        });
        it('AUTH-017: SQL Injection attempt in Profile', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: "Robert'); DROP TABLE users;--" })
                .expect(200);
        });
        it('AUTH-062: Profile Update handles empty name', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: '' })
                .expect(400);
        });
        it('AUTH-062: Profile Update handles very long name', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: 'a'.repeat(200) })
                .expect(400);
        });
        it('Security: Bearer token without space', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer${token}`)
                .expect(401);
        });
        it('Security: Expired Token (Mocked)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired`)
                .expect(401);
        });
        it('Security: POST to /auth/me should fail', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
        it('Security: GET /auth/profile should fail', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .get('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });
    });
    it('AUTH-062: PATCH /auth/profile - Success (Valid Data)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Updated Mechanic' })
            .expect(200)
            .then(res => {
            expect(res.body.fullName).toBe('Updated Mechanic');
        });
    });
    it('AUTH-061: PATCH /auth/profile - Fail (Invalid Data - Strict Zod)', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ invalidField: 'test' })
            .expect(400);
    });
    it('AUTH-073: Full Session Flow', async () => {
        const me = await (0, supertest_1.default)(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        const originalName = me.body.fullName;
        await (0, supertest_1.default)(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Session Test User' })
            .expect(200);
        const updatedMe = await (0, supertest_1.default)(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(updatedMe.body.fullName).toBe('Session Test User');
        await (0, supertest_1.default)(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: originalName })
            .expect(200);
    });
});
//# sourceMappingURL=session-management.e2e-spec.js.map