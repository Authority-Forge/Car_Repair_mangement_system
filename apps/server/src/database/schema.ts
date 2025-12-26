import { pgTable, serial, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('user_role', ['Mechanic', 'Advisor', 'Customer', 'Admin']);

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    email: text('email').unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    role: userRoleEnum('role').notNull(),
    fullName: text('full_name').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

import { integer, decimal, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const jobStatusEnum = pgEnum('job_status', ['In Progress', 'Waiting on Parts', 'Completed', 'Invoiced', 'Scheduled']);
export const recordTypeEnum = pgEnum('record_type', ['Labor', 'Part']);
export const noteTypeEnum = pgEnum('note_type', ['Internal', 'Customer']);

export const vehicles = pgTable('vehicles', {
    id: serial('id').primaryKey(),
    ownerId: integer('owner_id').references(() => users.id).notNull(),
    vin: text('vin').notNull(),
    make: text('make').notNull(),
    model: text('model').notNull(),
    year: integer('year').notNull(),
    mileage: integer('mileage').notNull(),
    licensePlate: text('license_plate').notNull(),
    engineType: text('engine_type'),
    imageUrl: text('image_url'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const jobs = pgTable('jobs', {
    id: serial('id').primaryKey(),
    vehicleId: integer('vehicle_id').references(() => vehicles.id).notNull(),
    customerId: integer('customer_id').references(() => users.id).notNull(),
    advisorId: integer('advisor_id').references(() => users.id).notNull(),
    status: jobStatusEnum('status').notNull().default('Scheduled'),
    description: text('description').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
});

export const workRecords = pgTable('work_records', {
    id: serial('id').primaryKey(),
    jobId: integer('job_id').references(() => jobs.id).notNull(),
    description: text('description').notNull(),
    type: recordTypeEnum('type').notNull(),
    quantity: decimal('quantity').notNull(),
    rate: decimal('rate').notNull(),
    total: decimal('total').notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});

export const jobNotes = pgTable('job_notes', {
    id: serial('id').primaryKey(),
    jobId: integer('job_id').references(() => jobs.id).notNull(),
    userId: integer('user_id').references(() => users.id).notNull(),
    content: text('content').notNull(),
    type: noteTypeEnum('type').notNull().default('Internal'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
    vehicles: many(vehicles),
    jobsAsCustomer: many(jobs, { relationName: 'customerJobs' }),
    jobsAsAdvisor: many(jobs, { relationName: 'advisorJobs' }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
    owner: one(users, {
        fields: [vehicles.ownerId],
        references: [users.id],
    }),
    jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
    vehicle: one(vehicles, {
        fields: [jobs.vehicleId],
        references: [vehicles.id],
    }),
    customer: one(users, {
        fields: [jobs.customerId],
        references: [users.id],
        relationName: 'customerJobs',
    }),
    advisor: one(users, {
        fields: [jobs.advisorId],
        references: [users.id],
        relationName: 'advisorJobs',
    }),
    workRecords: many(workRecords),
    notes: many(jobNotes),
}));

export const workRecordsRelations = relations(workRecords, ({ one }) => ({
    job: one(jobs, {
        fields: [workRecords.jobId],
        references: [jobs.id],
    }),
}));

export const jobNotesRelations = relations(jobNotes, ({ one }) => ({
    job: one(jobs, {
        fields: [jobNotes.jobId],
        references: [jobs.id],
    }),
    user: one(users, {
        fields: [jobNotes.userId],
        references: [users.id],
    }),
}));

export const auditLogs = pgTable('audit_logs', {
    id: serial('id').primaryKey(),
    userId: integer('user_id').references(() => users.id),
    action: text('action').notNull(),
    resource: text('resource').notNull(),
    payload: text('payload'), // JSON serialized payload
    ip: text('ip'),
    createdAt: timestamp('created_at').defaultNow(),
});

// Relations for AuditLogs
export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
    user: one(users, {
        fields: [auditLogs.userId],
        references: [users.id],
    }),
}));

export type Vehicle = typeof vehicles.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type WorkRecord = typeof workRecords.$inferSelect;
export type JobNote = typeof jobNotes.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
