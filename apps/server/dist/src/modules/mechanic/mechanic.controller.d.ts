import { MechanicService } from './mechanic.service';
import { CreateJobDto } from './dto/create-job.dto';
import { CreateWorkRecordDto } from './dto/create-work-record.dto';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateJobDto } from './dto/update-job.dto';
export declare class MechanicController {
    private readonly mechanicService;
    constructor(mechanicService: MechanicService);
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
    createJob(dto: CreateJobDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
    }>;
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
    addWorkRecord(id: number, dto: CreateWorkRecordDto): Promise<{
        id: number;
        createdAt: Date;
        description: string;
        jobId: number;
        type: "Labor" | "Part";
        quantity: string;
        rate: string;
        total: string;
    }>;
    addNote(id: number, dto: CreateNoteDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        jobId: number;
        type: "Customer" | "Internal";
        userId: number;
        content: string;
    }>;
    updateJob(id: number, dto: UpdateJobDto, req: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        vehicleId: number;
        customerId: number;
        advisorId: number;
        status: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
        description: string;
    }>;
    logAudit(body: {
        action: string;
        resource: string;
        payload?: any;
    }, req: any): Promise<{
        success: boolean;
    }>;
}
