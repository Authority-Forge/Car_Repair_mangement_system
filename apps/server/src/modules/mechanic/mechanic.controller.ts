import { Controller, Get, Post, Body, Param, UsePipes, Request, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { MechanicService } from './mechanic.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { CreateJobDto, CreateJobSchema } from './dto/create-job.dto';
import { CreateWorkRecordDto, CreateWorkRecordSchema } from './dto/create-work-record.dto';
import { CreateNoteDto, CreateNoteSchema } from './dto/create-note.dto';
import { UpdateJobDto, UpdateJobSchema } from './dto/update-job.dto';

@Controller('mechanic')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MechanicController {
    constructor(private readonly mechanicService: MechanicService) { }

    @Get('dashboard')
    @Roles('Mechanic', 'Admin')
    async getDashboardStats() {
        return this.mechanicService.getDashboardStats();
    }

    @Get('jobs')
    @Roles('Mechanic', 'Admin')
    async getActiveJobs() {
        return this.mechanicService.getActiveJobs();
    }

    @Post('jobs')
    @Roles('Mechanic', 'Admin')
    @UsePipes(new ZodValidationPipe(CreateJobSchema))
    async createJob(@Body() dto: CreateJobDto, @Request() req: any) {
        // advisorId could be passed in DTO or inferred from req.user
        // For flexibility, if DTO has it, use it, else default to req.user.id
        // But DTO makes it required.
        return this.mechanicService.createJob(dto, dto.advisorId);
    }

    @Get('jobs/:id')
    @Roles('Mechanic', 'Admin')
    async getJobById(@Param('id', ParseIntPipe) id: number) {
        return this.mechanicService.getJobById(id);
    }

    @Post('jobs/:id/records')
    @Roles('Mechanic', 'Admin')
    @UsePipes(new ZodValidationPipe(CreateWorkRecordSchema))
    async addWorkRecord(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateWorkRecordDto) {
        return this.mechanicService.addWorkRecord(id, dto);
    }

    @Post('jobs/:id/notes')
    @Roles('Mechanic', 'Admin')
    @UsePipes(new ZodValidationPipe(CreateNoteSchema))
    async addNote(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateNoteDto, @Request() req: any) {
        return this.mechanicService.addNote(id, dto, req.user.userId);
    }

    @Patch('jobs/:id')
    @Roles('Mechanic', 'Admin')
    @UsePipes(new ZodValidationPipe(UpdateJobSchema))
    async updateJob(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateJobDto, @Request() req: any) {
        return this.mechanicService.updateJob(id, dto, req.user.userId);
    }

    @Post('audit')
    @Roles('Mechanic', 'Admin')
    async logAudit(@Body() body: { action: string; resource: string; payload?: any }, @Request() req: any) {
        return this.mechanicService.logUiAction(req.user.userId, body.action, body.resource, body.payload);
    }
}
