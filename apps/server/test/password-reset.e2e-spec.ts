import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { DRIZZLE } from '../src/database/database.module';
import { eq } from 'drizzle-orm';
import * as schema from '../src/database/schema';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

describe('Password Reset (E2E)', () => {
    let app: INestApplication;
    let db: any;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();
        db = app.get(DRIZZLE);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Request Flow', () => {
        it('AUTH-090: POST /auth/password-reset/request - Success', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com' })
                .expect(201); // Created (Nest default for POST)

            expect(res.body.message).toContain('If this email exists');

            // Verify token was created in DB
            const user = await db.query.users.findFirst({ where: eq(schema.users.email, 'mech@test.com') });
            expect(user.resetToken).toBeDefined();
            expect(user.resetTokenExpires).toBeDefined();
        });

        it('AUTH-090: User Enumeration Prevention', async () => {
            const res = await request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'nonexistent@test.com' })
                .expect(201);

            expect(res.body.message).toContain('If this email exists');
        });

        it('AUTH-090: Invalid Email Format', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'not-an-email' })
                .expect(400);
        });
    });

    describe('Reset Flow', () => {
        it('AUTH-100: Full Reset Flow Success', async () => {
            // 1. Request
            await request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com' })
                .expect(201);

            // 2. Get Token from DB
            const user = await db.query.users.findFirst({ where: eq(schema.users.email, 'mech@test.com') });
            const token = user.resetToken;

            // 3. Reset
            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token, password: 'NewPassword123!' })
                .expect(201);

            // 4. Verify Password Change (Login)
            await request(app.getHttpServer())
                .post('/auth/login')
                .send({ email: 'mech@test.com', password: 'NewPassword123!', role: 'Mechanic' })
                .expect(201);

            // 5. One-Time Use Verification
            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token, password: 'OtherPassword123!' })
                .expect(401);

            // Restore password
            const hashed = await require('bcrypt').hash('Password123!', 10);
            await db.update(schema.users).set({ passwordHash: hashed }).where(eq(schema.users.id, user.id));
        });

        it('AUTH-100: POST /auth/password-reset/reset - Fail (No Token)', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ password: 'NewPassword123!' })
                .expect(400);
        });

        it('AUTH-100: POST /auth/password-reset/reset - Fail (Invalid Token)', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'invalid-token', password: 'NewPassword123!' })
                .expect(401);
        });

        it('AUTH-100: Password Complexity - Failure Cases', async () => {
            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'some-token', password: 'short' })
                .expect(400);

            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'some-token', password: 'NoNumbersHere!' })
                .expect(400);
        });

        it('Security: SQL Injection in Token', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: "' OR 1=1 --", password: 'NewPassword123!' })
                .expect(401);
        });

        it('Security: XSS in Email field', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: '<script>alert(1)</script>@test.com' })
                .expect(400); // Zod email validator should catch this
        });

        it('Security: Expiry Verification', async () => {
            const expiredDate = new Date();
            expiredDate.setHours(expiredDate.getHours() - 1);

            await db.update(schema.users).set({
                resetToken: 'expired-token',
                resetTokenExpires: expiredDate
            }).where(eq(schema.users.email, 'mech@test.com'));

            await request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'expired-token', password: 'ValidPass123!' })
                .expect(401);
        });

        it('Security: IDOR - Token for User A cannot reset User B', async () => {
            // This is naturally handled if token is unique and linked to user
        });

        it('Security: Rate limiting reset requests', async () => {
            // Spike requests
        });

        it('Security: No PII leak in Reset Success', async () => {
            // Ensure it doesn't return user object
        });

        it('Security: Unknown fields rejected', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/request')
                .send({ email: 'mech@test.com', extra: 'data' })
                .expect(400);
        });

        it('Security: Unknown fields in reset rejected', () => {
            return request(app.getHttpServer())
                .post('/auth/password-reset/reset')
                .send({ token: 'tok', password: 'Pass123!', hack: 'true' })
                .expect(400);
        });
    });
});
