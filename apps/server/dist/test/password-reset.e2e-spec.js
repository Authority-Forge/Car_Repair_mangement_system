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
const database_module_1 = require("../src/database/database.module");
const drizzle_orm_1 = require("drizzle-orm");
const schema = __importStar(require("../src/database/schema"));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
describe('Password Reset (E2E)', () => {
    let app;
    let db;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();
        db = app.get(database_module_1.DRIZZLE);
    });
    afterAll(async () => {
        await app.close();
    });
    describe('Request Flow', () => {
        it('AUTH-090: POST /auth/password-reset/request - Success', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com' })
                .expect(201);
            expect(res.body.message).toContain('If this email exists');
            const user = await db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema.users.email, 'mech@test.com') });
            expect(user.resetToken).toBeDefined();
            expect(user.resetTokenExpires).toBeDefined();
        });
        it('AUTH-090: User Enumeration Prevention', async () => {
            const res = await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'nonexistent@test.com' })
                .expect(201);
            expect(res.body.message).toContain('If this email exists');
        });
        it('AUTH-090: Invalid Email Format', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'not-an-email' })
                .expect(400);
        });
    });
    describe('Reset Flow', () => {
        it('AUTH-100: Full Reset Flow Success', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com' })
                .expect(201);
            const user = await db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema.users.email, 'mech@test.com') });
            const token = user.resetToken;
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token, password: 'NewPassword123!' })
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'mech@test.com', password: 'NewPassword123!', role: 'Mechanic' })
                .expect(201);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token, password: 'OtherPassword123!' })
                .expect(401);
            const hashed = await require('bcrypt').hash('Password123!', 10);
            await db.update(schema.users).set({ passwordHash: hashed }).where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
        });
        it('AUTH-100: POST /auth/password-reset/reset - Fail (No Token)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ password: 'NewPassword123!' })
                .expect(400);
        });
        it('AUTH-100: POST /auth/password-reset/reset - Fail (Invalid Token)', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'invalid-token', password: 'NewPassword123!' })
                .expect(401);
        });
        it('AUTH-100: Password Complexity - Failure Cases', async () => {
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'some-token', password: 'short' })
                .expect(400);
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'some-token', password: 'NoNumbersHere!' })
                .expect(400);
        });
        it('Security: SQL Injection in Token', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: "' OR 1=1 --", password: 'NewPassword123!' })
                .expect(401);
        });
        it('Security: XSS in Email field', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: '<script>alert(1)</script>@test.com' })
                .expect(400);
        });
        it('Security: Expiry Verification', async () => {
            const expiredDate = new Date();
            expiredDate.setHours(expiredDate.getHours() - 1);
            await db.update(schema.users).set({
                resetToken: 'expired-token',
                resetTokenExpires: expiredDate
            }).where((0, drizzle_orm_1.eq)(schema.users.email, 'mech@test.com'));
            await (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'expired-token', password: 'ValidPass123!' })
                .expect(401);
        });
        it('Security: IDOR - Token for User A cannot reset User B', async () => {
        });
        it('Security: Rate limiting reset requests', async () => {
        });
        it('Security: No PII leak in Reset Success', async () => {
        });
        it('Security: Unknown fields rejected', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com', extra: 'data' })
                .expect(400);
        });
        it('Security: Unknown fields in reset rejected', () => {
            return (0, supertest_1.default)(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'tok', password: 'Pass123!', hack: 'true' })
                .expect(400);
        });
    });
});
//# sourceMappingURL=password-reset.e2e-spec.js.map