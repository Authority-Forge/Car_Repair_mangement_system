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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MechanicController = void 0;
const common_1 = require("@nestjs/common");
const mechanic_service_1 = require("./mechanic.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const zod_validation_pipe_1 = require("../../common/pipes/zod-validation.pipe");
const create_job_dto_1 = require("./dto/create-job.dto");
const create_work_record_dto_1 = require("./dto/create-work-record.dto");
const create_note_dto_1 = require("./dto/create-note.dto");
const update_job_dto_1 = require("./dto/update-job.dto");
let MechanicController = class MechanicController {
    constructor(mechanicService) {
        this.mechanicService = mechanicService;
    }
    async getDashboardStats() {
        return this.mechanicService.getDashboardStats();
    }
    async getActiveJobs() {
        return this.mechanicService.getActiveJobs();
    }
    async createJob(dto, req) {
        return this.mechanicService.createJob(dto, dto.advisorId);
    }
    async getJobById(id) {
        return this.mechanicService.getJobById(id);
    }
    async addWorkRecord(id, dto) {
        return this.mechanicService.addWorkRecord(id, dto);
    }
    async addNote(id, dto, req) {
        return this.mechanicService.addNote(id, dto, req.user.userId);
    }
    async updateJob(id, dto, req) {
        return this.mechanicService.updateJob(id, dto, req.user.userId);
    }
    async logAudit(body, req) {
        return this.mechanicService.logUiAction(req.user.userId, body.action, body.resource, body.payload);
    }
};
exports.MechanicController = MechanicController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('jobs'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "getActiveJobs", null);
__decorate([
    (0, common_1.Post)('jobs'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_job_dto_1.CreateJobSchema)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "createJob", null);
__decorate([
    (0, common_1.Get)('jobs/:id'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "getJobById", null);
__decorate([
    (0, common_1.Post)('jobs/:id/records'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_work_record_dto_1.CreateWorkRecordSchema)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "addWorkRecord", null);
__decorate([
    (0, common_1.Post)('jobs/:id/notes'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(create_note_dto_1.CreateNoteSchema)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "addNote", null);
__decorate([
    (0, common_1.Patch)('jobs/:id'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    (0, common_1.UsePipes)(new zod_validation_pipe_1.ZodValidationPipe(update_job_dto_1.UpdateJobSchema)),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "updateJob", null);
__decorate([
    (0, common_1.Post)('audit'),
    (0, roles_decorator_1.Roles)('Mechanic', 'Admin'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MechanicController.prototype, "logAudit", null);
exports.MechanicController = MechanicController = __decorate([
    (0, common_1.Controller)('mechanic'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [mechanic_service_1.MechanicService])
], MechanicController);
//# sourceMappingURL=mechanic.controller.js.map