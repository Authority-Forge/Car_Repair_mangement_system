"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogsRelations = exports.auditLogs = exports.jobNotesRelations = exports.workRecordsRelations = exports.jobsRelations = exports.vehiclesRelations = exports.usersRelations = exports.jobNotes = exports.workRecords = exports.jobs = exports.vehicles = exports.noteTypeEnum = exports.recordTypeEnum = exports.jobStatusEnum = exports.users = exports.userRoleEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.userRoleEnum = (0, pg_core_1.pgEnum)('user_role', ['Mechanic', 'Advisor', 'Customer', 'Admin']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    email: (0, pg_core_1.text)('email').unique().notNull(),
    passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
    role: (0, exports.userRoleEnum)('role').notNull(),
    fullName: (0, pg_core_1.text)('full_name').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
const pg_core_2 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.jobStatusEnum = (0, pg_core_1.pgEnum)('job_status', ['In Progress', 'Waiting on Parts', 'Completed', 'Invoiced', 'Scheduled']);
exports.recordTypeEnum = (0, pg_core_1.pgEnum)('record_type', ['Labor', 'Part']);
exports.noteTypeEnum = (0, pg_core_1.pgEnum)('note_type', ['Internal', 'Customer']);
exports.vehicles = (0, pg_core_1.pgTable)('vehicles', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    ownerId: (0, pg_core_2.integer)('owner_id').references(() => exports.users.id).notNull(),
    vin: (0, pg_core_1.text)('vin').notNull(),
    make: (0, pg_core_1.text)('make').notNull(),
    model: (0, pg_core_1.text)('model').notNull(),
    year: (0, pg_core_2.integer)('year').notNull(),
    mileage: (0, pg_core_2.integer)('mileage').notNull(),
    licensePlate: (0, pg_core_1.text)('license_plate').notNull(),
    engineType: (0, pg_core_1.text)('engine_type'),
    imageUrl: (0, pg_core_1.text)('image_url'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.jobs = (0, pg_core_1.pgTable)('jobs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    vehicleId: (0, pg_core_2.integer)('vehicle_id').references(() => exports.vehicles.id).notNull(),
    customerId: (0, pg_core_2.integer)('customer_id').references(() => exports.users.id).notNull(),
    advisorId: (0, pg_core_2.integer)('advisor_id').references(() => exports.users.id).notNull(),
    status: (0, exports.jobStatusEnum)('status').notNull().default('Scheduled'),
    description: (0, pg_core_1.text)('description').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at').defaultNow(),
});
exports.workRecords = (0, pg_core_1.pgTable)('work_records', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobId: (0, pg_core_2.integer)('job_id').references(() => exports.jobs.id).notNull(),
    description: (0, pg_core_1.text)('description').notNull(),
    type: (0, exports.recordTypeEnum)('type').notNull(),
    quantity: (0, pg_core_2.decimal)('quantity').notNull(),
    rate: (0, pg_core_2.decimal)('rate').notNull(),
    total: (0, pg_core_2.decimal)('total').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.jobNotes = (0, pg_core_1.pgTable)('job_notes', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    jobId: (0, pg_core_2.integer)('job_id').references(() => exports.jobs.id).notNull(),
    userId: (0, pg_core_2.integer)('user_id').references(() => exports.users.id).notNull(),
    content: (0, pg_core_1.text)('content').notNull(),
    type: (0, exports.noteTypeEnum)('type').notNull().default('Internal'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(exports.users, ({ many }) => ({
    vehicles: many(exports.vehicles),
    jobsAsCustomer: many(exports.jobs, { relationName: 'customerJobs' }),
    jobsAsAdvisor: many(exports.jobs, { relationName: 'advisorJobs' }),
}));
exports.vehiclesRelations = (0, drizzle_orm_1.relations)(exports.vehicles, ({ one, many }) => ({
    owner: one(exports.users, {
        fields: [exports.vehicles.ownerId],
        references: [exports.users.id],
    }),
    jobs: many(exports.jobs),
}));
exports.jobsRelations = (0, drizzle_orm_1.relations)(exports.jobs, ({ one, many }) => ({
    vehicle: one(exports.vehicles, {
        fields: [exports.jobs.vehicleId],
        references: [exports.vehicles.id],
    }),
    customer: one(exports.users, {
        fields: [exports.jobs.customerId],
        references: [exports.users.id],
        relationName: 'customerJobs',
    }),
    advisor: one(exports.users, {
        fields: [exports.jobs.advisorId],
        references: [exports.users.id],
        relationName: 'advisorJobs',
    }),
    workRecords: many(exports.workRecords),
    notes: many(exports.jobNotes),
}));
exports.workRecordsRelations = (0, drizzle_orm_1.relations)(exports.workRecords, ({ one }) => ({
    job: one(exports.jobs, {
        fields: [exports.workRecords.jobId],
        references: [exports.jobs.id],
    }),
}));
exports.jobNotesRelations = (0, drizzle_orm_1.relations)(exports.jobNotes, ({ one }) => ({
    job: one(exports.jobs, {
        fields: [exports.jobNotes.jobId],
        references: [exports.jobs.id],
    }),
    user: one(exports.users, {
        fields: [exports.jobNotes.userId],
        references: [exports.users.id],
    }),
}));
exports.auditLogs = (0, pg_core_1.pgTable)('audit_logs', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    userId: (0, pg_core_2.integer)('user_id').references(() => exports.users.id),
    action: (0, pg_core_1.text)('action').notNull(),
    resource: (0, pg_core_1.text)('resource').notNull(),
    payload: (0, pg_core_1.text)('payload'),
    ip: (0, pg_core_1.text)('ip'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
exports.auditLogsRelations = (0, drizzle_orm_1.relations)(exports.auditLogs, ({ one }) => ({
    user: one(exports.users, {
        fields: [exports.auditLogs.userId],
        references: [exports.users.id],
    }),
}));
//# sourceMappingURL=schema.js.map