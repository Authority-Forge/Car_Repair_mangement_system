"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const supertest_1 = __importDefault(require("supertest"));
const app_module_1 = require("./../src/app.module");
const roles_decorator_1 = require("../src/common/decorators/roles.decorator");
const roles_guard_1 = require("../src/common/guards/roles.guard");
const jwt_1 = require("@nestjs/jwt");
const jwt_auth_guard_1 = require("../src/modules/auth/guards/jwt-auth.guard");
let TestRolesController = class TestRolesController {
    getAdmin() { return { message: 'Admin Access' }; }
    getMechanic() { return { message: 'Mechanic Access' }; }
    getMixed() { return { message: 'Mixed Access' }; }
    getPublic() { return { message: 'Public Access' }; }
};
__decorate([
    (0, common_1.Get)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestRolesController.prototype, "getAdmin", null);
__decorate([
    (0, common_1.Get)('mechanic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Mechanic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestRolesController.prototype, "getMechanic", null);
__decorate([
    (0, common_1.Get)('mixed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('Admin', 'Mechanic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestRolesController.prototype, "getMixed", null);
__decorate([
    (0, common_1.Get)('public'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestRolesController.prototype, "getPublic", null);
TestRolesController = __decorate([
    (0, common_1.Controller)('test-roles')
], TestRolesController);
describe('Roles & Session (e2e)', () => {
    let app;
    let jwtService;
    beforeEach(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
            controllers: [TestRolesController],
        }).compile();
        app = moduleFixture.createNestApplication();
        jwtService = moduleFixture.get(jwt_1.JwtService);
        await app.init();
    });
    afterEach(async () => {
        await app.close();
    });
    const createToken = (role, expiresIn = '1h') => {
        return jwtService.sign({ email: 'test@example.com', sub: '123', role }, { expiresIn });
    };
    it('AUTH-041: Admin accesses Admin Route', () => {
        const token = createToken('Admin');
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect({ message: 'Admin Access' });
    });
    it('AUTH-042: Mechanic accesses Mechanic Route', () => {
        const token = createToken('Mechanic');
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/mechanic')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect({ message: 'Mechanic Access' });
    });
    it('AUTH-043: Mechanic CANNOT access Admin Route', () => {
        const token = createToken('Mechanic');
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });
    it('AUTH-044: Customer CANNOT access Mechanic Route', () => {
        const token = createToken('Customer');
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/mechanic')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });
    it('AUTH-045: Mixed Route allows both', async () => {
        const token1 = createToken('Admin');
        await (0, supertest_1.default)(app.getHttpServer()).get('/test-roles/mixed').set('Authorization', `Bearer ${token1}`).expect(200);
        const token2 = createToken('Mechanic');
        await (0, supertest_1.default)(app.getHttpServer()).get('/test-roles/mixed').set('Authorization', `Bearer ${token2}`).expect(200);
    });
    it('AUTH-046: Public Route allows everyone', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/public')
            .expect(200);
    });
    it('AUTH-047: Expired Token Rejected', async () => {
        const token = jwtService.sign({ email: 'exp@test.com', sub: '123', role: 'Admin' }, { expiresIn: '-1s' });
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(401);
    });
    it('AUTH-048: Malformed Token Rejected', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer malformed.token`)
            .expect(401);
    });
    it('AUTH-049: Missing Token Rejected', () => {
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .expect(401);
    });
    it('AUTH-050: Wrong Signature Rejected', () => {
        const fakeToken = jwtService.sign({ role: 'Admin' }, { secret: 'wrong-secret' });
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${fakeToken}`)
            .expect(401);
    });
    it('AUTH-051: Role Injection Attempt', () => {
        const token = createToken('Customer');
        return (0, supertest_1.default)(app.getHttpServer())
            .get('/test-roles/admin')
            .set('Authorization', `Bearer ${token}`)
            .expect(403);
    });
});
//# sourceMappingURL=roles.e2e-spec.js.map