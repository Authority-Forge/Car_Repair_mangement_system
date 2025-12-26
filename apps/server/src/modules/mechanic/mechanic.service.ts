import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { DRIZZLE } from '../../database/database.module';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { eq, desc, sql, and, ne } from 'drizzle-orm';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateWorkRecordDto } from './dto/create-work-record.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class MechanicService {
    constructor(
        @Inject(DRIZZLE) private db: PostgresJsDatabase<typeof schema>,
        private audit: AuditService,
    ) { }

    async getDashboardStats() {
        const [activeJobsCount] = await this.db
            .select({ count: sql<number>`count(*)` })
            .from(schema.jobs)
            .where(sql`${schema.jobs.status} != 'Completed' AND ${schema.jobs.status} != 'Invoiced'`);

        const [revenue] = await this.db
            .select({ total: sql<number>`sum(${schema.workRecords.total})` })
            .from(schema.workRecords)
            .where(sql`DATE(${schema.workRecords.createdAt}) = CURRENT_DATE`);

        return {
            activeJobs: Number(activeJobsCount.count),
            dailyRevenue: Number(revenue?.total || 0),
            pendingParts: 3, // Mock for now
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

    async getJobById(id: number) {
        if (isNaN(id)) throw new BadRequestException('Invalid Job ID');

        const job = await this.db.query.jobs.findFirst({
            where: eq(schema.jobs.id, id),
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

        if (!job) throw new NotFoundException(`Job #${id} not found`);

        // Fetch history for the same vehicle (excluding current job)
        const history = await this.db.query.jobs.findMany({
            where: (jobs, { eq, and, ne }) => and(
                eq(jobs.vehicleId, job.vehicleId),
                ne(jobs.id, id)
            ),
            orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
            limit: 5
        });

        return { ...job, history };
    }

    async createJob(dto: CreateJobDto, advisorId: number) {
        // Explicitly map to ensure types match Drizzle schema requirements
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

    async updateJob(id: number, dto: UpdateJobDto, userId: number) {
        const existing = await this.db.query.jobs.findFirst({ where: eq(schema.jobs.id, id) });
        if (!existing) throw new NotFoundException('Job not found');

        const [job] = await this.db.update(schema.jobs)
            .set({
                ...dto,
                updatedAt: new Date(),
            })
            .where(eq(schema.jobs.id, id))
            .returning();

        await this.audit.logAction(userId, 'UPDATE_JOB', `job:${id}`, dto);
        return job;
    }

    async logUiAction(userId: number, action: string, resource: string, payload?: any) {
        await this.audit.logAction(userId, action, resource, payload);
        return { success: true };
    }

    async addWorkRecord(jobId: number, dto: CreateWorkRecordDto) {
        // Check if job exists
        const job = await this.db.query.jobs.findFirst({ where: eq(schema.jobs.id, jobId) });
        if (!job) throw new NotFoundException('Job not found');

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

    async addNote(jobId: number, dto: CreateNoteDto, userId: number) {
        // Check if job exists
        const job = await this.db.query.jobs.findFirst({ where: eq(schema.jobs.id, jobId) });
        if (!job) throw new NotFoundException('Job not found');

        const [note] = await this.db.insert(schema.jobNotes).values({
            jobId: jobId,
            userId: userId,
            content: dto.content,
            type: dto.type,
        }).returning();

        await this.audit.logAction(userId, 'ADD_NOTE', `job:${jobId}:note:${note.id}`, { type: dto.type });
        return note;
    }

    private getStatusColor(status: string) {
        switch (status) {
            case 'In Progress': return 'blue';
            case 'Waiting on Parts': return 'amber';
            case 'Completed': return 'green';
            case 'Invoiced': return 'slate';
            case 'Urgent': return 'red';
            default: return 'slate';
        }
    }
}
