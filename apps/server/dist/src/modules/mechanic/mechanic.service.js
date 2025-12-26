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
exports.MechanicService = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const schema = __importStar(require("../../database/schema"));
const drizzle_orm_1 = require("drizzle-orm");
const audit_service_1 = require("../audit/audit.service");
let MechanicService = class MechanicService {
    constructor(db, audit) {
        this.db = db;
        this.audit = audit;
    }
    async getDashboardStats() {
        const [activeJobsCount] = await this.db
            .select({ count: (0, drizzle_orm_1.sql) `count(*)` })
            .from(schema.jobs)
            .where((0, drizzle_orm_1.sql) `${schema.jobs.status} != 'Completed' AND ${schema.jobs.status} != 'Invoiced'`);
        const [revenue] = await this.db
            .select({ total: (0, drizzle_orm_1.sql) `sum(${schema.workRecords.total})` })
            .from(schema.workRecords)
            .where((0, drizzle_orm_1.sql) `DATE(${schema.workRecords.createdAt}) = CURRENT_DATE`);
        return {
            activeJobs: Number(activeJobsCount.count),
            dailyRevenue: Number(revenue?.total || 0),
            pendingParts: 3,
        };
    }
    async getActiveJobs() {
        return this.db.query.jobs.findMany({
            with: {
                vehicle: true,
                customer: true,
                advisor: true,
            },
            where: (jobs, { notInArray }) => notInArray(jobs.status, ['Completed', 'Invoiced']),
            orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
            limit: 10,
        });
    }
    async getJobById(id) {
        if (isNaN(id))
            throw new common_1.BadRequestException('Invalid Job ID');
        const job = await this.db.query.jobs.findFirst({
            where: (0, drizzle_orm_1.eq)(schema.jobs.id, id),
            with: {
                vehicle: true,
                customer: true,
                advisor: true,
                workRecords: true,
                notes: {
                    with: { user: true },
                    orderBy: (notes, { asc }) => [asc(notes.createdAt)],
                },
            },
        });
        if (!job)
            throw new common_1.NotFoundException(`Job #${id} not found`);
        const history = await this.db.query.jobs.findMany({
            where: (jobs, { eq, and, ne }) => and(eq(jobs.vehicleId, job.vehicleId), ne(jobs.id, id)),
            orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
            limit: 5
        });
        return { ...job, history };
    }
    async createJob(dto, advisorId) {
        const [job] = await this.db.insert(schema.jobs).values({
            vehicleId: dto.vehicleId,
            customerId: dto.customerId,
            advisorId: advisorId,
            description: dto.description,
            status: dto.status || 'Scheduled',
        }).returning();
        await this.audit.logAction(advisorId, 'CREATE_JOB', `job:${job.id}`, dto);
        return job;
    }
    async updateJob(id, dto, userId) {
        const existing = await this.db.query.jobs.findFirst({ where: (0, drizzle_orm_1.eq)(schema.jobs.id, id) });
        if (!existing)
            throw new common_1.NotFoundException('Job not found');
        const [job] = await this.db.update(schema.jobs)
            .set({
            ...dto,
            updatedAt: new Date(),
        })
            .where((0, drizzle_orm_1.eq)(schema.jobs.id, id))
            .returning();
        await this.audit.logAction(userId, 'UPDATE_JOB', `job:${id}`, dto);
        return job;
    }
    async logUiAction(userId, action, resource, payload) {
        await this.audit.logAction(userId, action, resource, payload);
        return { success: true };
    }
    async addWorkRecord(jobId, dto) {
        const job = await this.db.query.jobs.findFirst({ where: (0, drizzle_orm_1.eq)(schema.jobs.id, jobId) });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const [record] = await this.db.insert(schema.workRecords).values({
            jobId: jobId,
            description: dto.description,
            type: dto.type,
            quantity: String(dto.quantity),
            rate: String(dto.rate),
            total: String(dto.total),
        }).returning();
        await this.audit.logAction(null, 'ADD_WORK_RECORD', `job:${jobId}:record:${record.id}`, dto);
        return record;
    }
    async addNote(jobId, dto, userId) {
        const job = await this.db.query.jobs.findFirst({ where: (0, drizzle_orm_1.eq)(schema.jobs.id, jobId) });
        if (!job)
            throw new common_1.NotFoundException('Job not found');
        const [note] = await this.db.insert(schema.jobNotes).values({
            jobId: jobId,
            userId: userId,
            content: dto.content,
            type: dto.type,
        }).returning();
        await this.audit.logAction(userId, 'ADD_NOTE', `job:${jobId}:note:${note.id}`, { type: dto.type });
        return note;
    }
    getStatusColor(status) {
        switch (status) {
            case 'In Progress': return 'blue';
            case 'Waiting on Parts': return 'amber';
            case 'Completed': return 'green';
            case 'Invoiced': return 'slate';
            case 'Urgent': return 'red';
            default: return 'slate';
        }
    }
};
exports.MechanicService = MechanicService;
exports.MechanicService = MechanicService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(database_module_1.DRIZZLE)),
    __metadata("design:paramtypes", [Object, audit_service_1.AuditService])
], MechanicService);
//# sourceMappingURL=mechanic.service.js.map