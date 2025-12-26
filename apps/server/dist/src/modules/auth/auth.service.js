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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const crypto = __importStar(require("crypto"));
const database_module_1 = require("../../database/database.module");
const schema = __importStar(require("../../database/schema"));
const drizzle_orm_1 = require("drizzle-orm");
let AuthService = class AuthService {
    constructor(jwtService, db) {
        this.jwtService = jwtService;
        this.db = db;
    }
    async validateUser(email, pass) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, email)
        });
        if (user && await bcrypt.compare(pass, user.passwordHash)) {
            const { passwordHash, ...result } = user;
            return result;
        }
        return null;
    }
    async login(loginDto) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, loginDto.email)
        });
        if (!user || !(await bcrypt.compare(loginDto.password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (loginDto.role && user.role !== loginDto.role) {
            throw new common_1.UnauthorizedException('Role mismatch');
        }
        return this.generateToken(user);
    }
    async register(registerDto) {
        const existing = await this.db.query.users.findFirst({ where: (0, drizzle_orm_1.eq)(schema.users.email, registerDto.email) });
        if (existing) {
            throw new common_1.BadRequestException('User already exists');
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
    async getProfile(userId) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.id, userId)
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const { passwordHash, ...result } = user;
        return result;
    }
    async updateProfile(userId, updateDto) {
        const [updatedUser] = await this.db.update(schema.users)
            .set(updateDto)
            .where((0, drizzle_orm_1.eq)(schema.users.id, userId))
            .returning();
        if (!updatedUser) {
            throw new common_1.BadRequestException('Failed to update profile');
        }
        const { passwordHash, ...result } = updatedUser;
        return result;
    }
    async requestPasswordReset(dto) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.users.email, dto.email)
        });
        if (user) {
            const token = crypto.randomBytes(32).toString('hex');
            const expires = new Date();
            expires.setHours(expires.getHours() + 1);
            await this.db.update(schema.users)
                .set({ resetToken: token, resetTokenExpires: expires })
                .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
            console.log(`[PASSWORD RESET] Token for ${user.email}: ${token}`);
        }
        return { message: 'If this email exists in our records, a reset link has been sent.' };
    }
    async resetPassword(dto) {
        const user = await this.db.query.users.findFirst({
            where: (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema.users.resetToken, dto.token), (0, drizzle_orm_1.gt)(schema.users.resetTokenExpires, new Date()))
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        await this.db.update(schema.users)
            .set({
            passwordHash: hashedPassword,
            resetToken: null,
            resetTokenExpires: null
        })
            .where((0, drizzle_orm_1.eq)(schema.users.id, user.id));
        return { message: 'Password has been reset successfully.' };
    }
    generateToken(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [jwt_1.JwtService, Object])
], AuthService);
//# sourceMappingURL=auth.service.js.map