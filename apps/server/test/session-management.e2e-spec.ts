import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

describe('Session Management (E2E)', () => {
    let app: INestApplication;
    let token: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
        await app.init();

        // Login to get token
        const loginRes = await request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'mech@test.com', password: 'Password123!', role: 'Mechanic' });

        token = loginRes.body.access_token;
    });

    afterAll(async () => {
        await app.close();
    });

    it('AUTH-061: GET /auth/me - Success', () => {
        return request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .then(res => {
                expect(res.body.email).toBe('mech@test.com');
                expect(res.body.role).toBe('Mechanic');
                expect(res.body.passwordHash).toBeUndefined(); // Security: No PII leak
            });
    });

    it('AUTH-061: GET /auth/me - Fail (No Token)', () => {
        return request(app.getHttpServer())
            .get('/auth/me')
            .expect(401);
    });

    it('AUTH-061: GET /auth/me - Fail (Invalid Token)', () => {
        return request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer invalid-token`)
            .expect(401);
    });

    describe('Security & Edge Cases', () => {
        it('AUTH-061: No PII leak in profile', async () => {
            const res = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${token}`);

            const bodyStr = JSON.stringify(res.body);
            expect(bodyStr).not.toContain('passwordHash');
            expect(bodyStr).not.toContain('hash');
        });

        it('AUTH-062: PATCH /auth/profile - Success (Valid)', () => {
            return request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: 'Verified Mechanic' })
                .expect(200);
        });

        it('AUTH-062: PATCH /auth/profile - Fail (Strict Zod)', () => {
            return request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ something: 'evil', fullName: 'Too Long' })
                .expect(400);
        });

        it('AUTH-062: PATCH /auth/profile - Ignore Immutable Field (role)', async () => {
            // Attempt to escalate role
            await request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ role: 'Admin' })
                .expect(400); // Because of .strict() on DTO
        });

        it('AUTH-062: PATCH /auth/profile - Ignore Immutable Field (id)', async () => {
            await request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ id: 9999 })
                .expect(400); // Because of .strict() on DTO
        });

        it('AUTH-044: XSS Sanitization check in Profile', async () => {
            const xssPayload = '<script>alert(1)</script>';
            await request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: xssPayload })
                .expect(200);

            const res = await request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.body.fullName).toBe(xssPayload);
            // Note: We store as is but front-end MUST escape. 
            // Some systems sanitize on entry - let's verify if we want that.
        });

        it('AUTH-017: SQL Injection attempt in Profile', () => {
            return request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: "Robert'); DROP TABLE users;--" })
                .expect(200); // Should be accepted as a string, not executed
        });

        it('AUTH-062: Profile Update handles empty name', () => {
            return request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: '' })
                .expect(400); // Zod min(2)
        });

        it('AUTH-062: Profile Update handles very long name', () => {
            return request(app.getHttpServer())
                .patch('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .send({ fullName: 'a'.repeat(200) })
                .expect(400); // Zod max(100)
        });

        it('Security: Bearer token without space', () => {
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer${token}`)
                .expect(401);
        });

        it('Security: Expired Token (Mocked)', () => {
            // This would require a mocked clock or a specific expired token
            // For now, testing malformed as proxy
            return request(app.getHttpServer())
                .get('/auth/me')
                .set('Authorization', `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.expired`)
                .expect(401);
        });

        it('Security: POST to /auth/me should fail', () => {
            return request(app.getHttpServer())
                .post('/auth/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(404);
        });

        it('Security: GET /auth/profile should fail', () => {
            return request(app.getHttpServer())
                .get('/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(404); // We only defined PATCH
        });
    });

    it('AUTH-062: PATCH /auth/profile - Success (Valid Data)', () => {
        return request(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Updated Mechanic' })
            .expect(200)
            .then(res => {
                expect(res.body.fullName).toBe('Updated Mechanic');
            });
    });

    it('AUTH-061: PATCH /auth/profile - Fail (Invalid Data - Strict Zod)', () => {
        return request(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ invalidField: 'test' })
            .expect(400); // Strict schema should reject unknown fields
    });

    it('AUTH-073: Full Session Flow', async () => {
        // 1. Get Me
        const me = await request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const originalName = me.body.fullName;

        // 2. Update Profile
        await request(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: 'Session Test User' })
            .expect(200);

        // 3. Verify Update
        const updatedMe = await request(app.getHttpServer())
            .get('/auth/me')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(updatedMe.body.fullName).toBe('Session Test User');

        // Restore original name
        await request(app.getHttpServer())
            .patch('/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({ fullName: originalName })
            .expect(200);
    });
});
