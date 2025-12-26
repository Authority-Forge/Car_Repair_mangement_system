import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../database/schema';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateWorkRecordDto } from './dto/create-work-record.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { AuditService } from '../audit/audit.service';
export declare class MechanicService {
    private db;
    private audit;
    constructor(db: PostgresJsDatabase<typeof schema>, audit: AuditService);
    getDashboardStats(): Promise<{
        activeJobs: number;
        dailyRevenue: number;
        pendingParts: number;
    }>;
    getActiveJobs(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
        vehicle: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number;
            vin: string;
            make: string;
            model: string;
            year: number;
            mileage: number;
            licensePlate: string;
            engineType: string;
            imageUrl: string;
        };
        customer: {
            id: number;
            email: string;
            passwordHash: string;
            role: "Mechanic" | "Advisor" | "Customer" | "Admin";
            fullName: string;
            resetToken: string;
            resetTokenExpires: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        advisor: {
            id: number;
            email: string;
            passwordHash: string;
            role: "Mechanic" | "Advisor" | "Customer" | "Admin";
            fullName: string;
            resetToken: string;
            resetTokenExpires: Date;
            createdAt: Date;
            updatedAt: Date;
        };
    }[]>;
    getJobById(id: number): Promise<{
        history: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            vehicleId: number;
            customerId: number;
            advisorId: number;
            status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
            description: string;
        }[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
        vehicle: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ownerId: number;
            vin: string;
            make: string;
            model: string;
            year: number;
            mileage: number;
            licensePlate: string;
            engineType: string;
            imageUrl: string;
        };
        customer: {
            id: number;
            email: string;
            passwordHash: string;
            role: "Mechanic" | "Advisor" | "Customer" | "Admin";
            fullName: string;
            resetToken: string;
            resetTokenExpires: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        advisor: {
            id: number;
            email: string;
            passwordHash: string;
            role: "Mechanic" | "Advisor" | "Customer" | "Admin";
            fullName: string;
            resetToken: string;
            resetTokenExpires: Date;
            createdAt: Date;
            updatedAt: Date;
        };
        workRecords: {
            id: number;
            createdAt: Date;
            description: string;
            jobId: number;
            type: "Labor" | "Part";
            quantity: string;
            rate: string;
            total: string;
        }[];
        notes: {
            id: number;
            createdAt: Date;
            jobId: number;
            type: "Customer" | "Internal";
            userId: number;
            content: string;
            user: {
                id: number;
                email: string;
                passwordHash: string;
                role: "Mechanic" | "Advisor" | "Customer" | "Admin";
                fullName: string;
                resetToken: string;
                resetTokenExpires: Date;
                createdAt: Date;
                updatedAt: Date;
            };
        }[];
    }>;
    createJob(dto: CreateJobDto, advisorId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
    }>;
    updateJob(id: number, dto: UpdateJobDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
    }>;
    logUiAction(userId: number, action: string, resource: string, payload?: any): Promise<{
        success: boolean;
    }>;
    addWorkRecord(jobId: number, dto: CreateWorkRecordDto): Promise<{
        id: number;
        createdAt: Date;
        description: string;
        jobId: number;
        type: "Labor" | "Part";
        quantity: string;
        rate: string;
        total: string;
    }>;
    addNote(jobId: number, dto: CreateNoteDto, userId: number): Promise<{
        id: number;
        createdAt: Date;
        jobId: number;
        type: "Customer" | "Internal";
        userId: number;
        content: string;
    }>;
    private getStatusColor;
}
