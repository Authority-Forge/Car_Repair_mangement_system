import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    // AUTH-003: POST Logic endpoint returns 200 OK
    it('/auth/login (POST) - Success', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password', // Matching the hardcoded mock in service
                role: 'Mechanic',
            })
            .expect(201) // NestJS Post default is 201
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body.user.email).toBe('test@example.com');
            });
    });

    // AUTH-004: POST Login endpoint returns 400 on bad data
    it('/auth/login (POST) - Fail Validation', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'bad-email',
                password: 'short',
                role: 'Invalid',
            })
            .expect(400); // Validation Pipe should throw 400
    });

    // Edge cases
    it('/auth/login (POST) - Fail Missing Fields', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({ email: 'test@example.com' })
            .expect(400);
    });

    // AUTH-022: Register Success
    it('/auth/register (POST) - Success', async () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'newuser@example.com',
                password: 'Password123!',
                fullName: 'New User',
                role: 'Customer'
            })
            .expect(201)
            .expect((res) => {
                expect(res.body).toHaveProperty('access_token');
                expect(res.body.user.email).toBe('newuser@example.com');
                expect(res.body.user.fullName).toBe('New User');
            });
    });

    // AUTH-023: Register Fail - Weak Password
    it('/auth/register (POST) - Fail Weak Password', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'weak@example.com',
                password: 'weak',
                fullName: 'Weak Pwd',
                role: 'Customer'
            })
            .expect(400);
    });
});
