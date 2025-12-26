import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Controller, Get, UseGuards, UnauthorizedException } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { Roles } from '../src/common/decorators/roles.decorator';
import { RolesGuard } from '../src/common/guards/roles.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from '../src/modules/auth/guards/jwt-auth.guard';

// Mock Protected Controller for Testing
@Controller('test-roles')
class TestRolesController {
    @Get('admin')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin')
    getAdmin() { return { message: 'Admin Access' }; }

    @Get('mechanic')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Mechanic')
    getMechanic() { return { message: 'Mechanic Access' }; }

    @Get('mixed')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('Admin', 'Mechanic')
    getMixed() { return { message: 'Mixed Access' }; }

    @Get('public')
    getPublic() { return { message: 'Public Access' }; }
}

describe('Roles & Session (e2e)', () => {
    let app: INestApplication;
    let jwtService: JwtService;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
            controllers: [TestRolesController], // We inject this controller dynamically
        }).compile();

        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get<JwtService>(JwtService);
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    const createToken = (role: string, expiresIn = '1h') => {
        return jwtService.sign({ email: 'test@example.com', sub: '123', role }, { expiresIn });
    };

    // --- Role Based Access Tests ---

    // AUTH-041
    it('AUTH-041: Admin accesses Admin Route', () => {
        const token = createToken('Admin');
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect({ message: 'Admin Access' });
    });

    // AUTH-042
    it('AUTH-042: Mechanic accesses Mechanic Route', () => {
        const token = createToken('Mechanic');
        return request(app.getHttpServer())
            .get('/test-roles/mechanic')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect({ message: 'Mechanic Access' });
    });

    // AUTH-043
    it('AUTH-043: Mechanic CANNOT access Admin Route', () => {
        const token = createToken('Mechanic');
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });

    // AUTH-044
    it('AUTH-044: Customer CANNOT access Mechanic Route', () => {
        const token = createToken('Customer');
        return request(app.getHttpServer())
            .get('/test-roles/mechanic')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });

    // AUTH-045
    it('AUTH-045: Mixed Route allows both', async () => {
        const token1 = createToken('Admin');
        await request(app.getHttpServer()).get('/test-roles/mixed').set('Authorization', `Bearer ${token1}`).expect(200);

        const token2 = createToken('Mechanic');
        await request(app.getHttpServer()).get('/test-roles/mixed').set('Authorization', `Bearer ${token2}`).expect(200);
    });

    // AUTH-046
    it('AUTH-046: Public Route allows everyone', () => {
        return request(app.getHttpServer())
            .get('/test-roles/public')
            .expect(200);
    });

    // --- Session & Token Tests ---

    // AUTH-047
    it('AUTH-047: Expired Token Rejected', async () => {
        // Create token expiring in -1s
        const token = jwtService.sign({ email: 'exp@test.com', sub: '123', role: 'Admin' }, { expiresIn: '-1s' });
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(401); // Unauthorized
    });

    // AUTH-048
    it('AUTH-048: Malformed Token Rejected', () => {
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer malformed.token`)
            .expect(401);
    });

    // AUTH-049
    it('AUTH-049: Missing Token Rejected', () => {
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .expect(401);
    });

    // AUTH-050
    it('AUTH-050: Wrong Signature Rejected', () => {
        // Sign with different secret
        const fakeToken = jwtService.sign({ role: 'Admin' }, { secret: 'wrong-secret' });
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${fakeToken}`)
            .expect(401);
    });

    // AUTH-051
    it('AUTH-051: Role Injection Attempt', () => {
        // A user tries to inject a role they don't have via Payload modification without signature ? 
        // JWT signature prevents this. If signature invalid -> 401.
        // If they act as valid user but try to access invalid resources -> 403.
        const token = createToken('Customer');
        return request(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });
});
