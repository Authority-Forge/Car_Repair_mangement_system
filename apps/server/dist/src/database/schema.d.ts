export declare const userRoleEnum: import("drizzle-orm/pg-core").PgEnum<["Mechanic", "Advisor", "Customer", "Admin"]>;
export declare const users: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "users";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        email: import("drizzle-orm/pg-core").PgColumn<{
            name: "email";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        passwordHash: import("drizzle-orm/pg-core").PgColumn<{
            name: "password_hash";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        role: import("drizzle-orm/pg-core").PgColumn<{
            name: "role";
            tableName: "users";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "Mechanic" | "Advisor" | "Customer" | "Admin";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["Mechanic", "Advisor", "Customer", "Admin"];
            baseColumn: never;
        }, {}, {}>;
        fullName: import("drizzle-orm/pg-core").PgColumn<{
            name: "full_name";
            tableName: "users";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "users";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const jobStatusEnum: import("drizzle-orm/pg-core").PgEnum<["In Progress", "Waiting on Parts", "Completed", "Invoiced", "Scheduled"]>;
export declare const recordTypeEnum: import("drizzle-orm/pg-core").PgEnum<["Labor", "Part"]>;
export declare const noteTypeEnum: import("drizzle-orm/pg-core").PgEnum<["Internal", "Customer"]>;
export declare const vehicles: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "vehicles";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "vehicles";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        ownerId: import("drizzle-orm/pg-core").PgColumn<{
            name: "owner_id";
            tableName: "vehicles";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        vin: import("drizzle-orm/pg-core").PgColumn<{
            name: "vin";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        make: import("drizzle-orm/pg-core").PgColumn<{
            name: "make";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        model: import("drizzle-orm/pg-core").PgColumn<{
            name: "model";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        year: import("drizzle-orm/pg-core").PgColumn<{
            name: "year";
            tableName: "vehicles";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        mileage: import("drizzle-orm/pg-core").PgColumn<{
            name: "mileage";
            tableName: "vehicles";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        licensePlate: import("drizzle-orm/pg-core").PgColumn<{
            name: "license_plate";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        engineType: import("drizzle-orm/pg-core").PgColumn<{
            name: "engine_type";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        imageUrl: import("drizzle-orm/pg-core").PgColumn<{
            name: "image_url";
            tableName: "vehicles";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "vehicles";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "vehicles";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const jobs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "jobs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "jobs";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        vehicleId: import("drizzle-orm/pg-core").PgColumn<{
            name: "vehicle_id";
            tableName: "jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        customerId: import("drizzle-orm/pg-core").PgColumn<{
            name: "customer_id";
            tableName: "jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        advisorId: import("drizzle-orm/pg-core").PgColumn<{
            name: "advisor_id";
            tableName: "jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "jobs";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "In Progress" | "Waiting on Parts" | "Completed" | "Invoiced" | "Scheduled";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: ["In Progress", "Waiting on Parts", "Completed", "Invoiced", "Scheduled"];
            baseColumn: never;
        }, {}, {}>;
        description: import("drizzle-orm/pg-core").PgColumn<{
            name: "description";
            tableName: "jobs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "jobs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "jobs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const workRecords: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "work_records";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "work_records";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        jobId: import("drizzle-orm/pg-core").PgColumn<{
            name: "job_id";
            tableName: "work_records";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        description: import("drizzle-orm/pg-core").PgColumn<{
            name: "description";
            tableName: "work_records";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        type: import("drizzle-orm/pg-core").PgColumn<{
            name: "type";
            tableName: "work_records";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "Labor" | "Part";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: ["Labor", "Part"];
            baseColumn: never;
        }, {}, {}>;
        quantity: import("drizzle-orm/pg-core").PgColumn<{
            name: "quantity";
            tableName: "work_records";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        rate: import("drizzle-orm/pg-core").PgColumn<{
            name: "rate";
            tableName: "work_records";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        total: import("drizzle-orm/pg-core").PgColumn<{
            name: "total";
            tableName: "work_records";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "work_records";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const jobNotes: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "job_notes";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "job_notes";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        jobId: import("drizzle-orm/pg-core").PgColumn<{
            name: "job_id";
            tableName: "job_notes";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "job_notes";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        content: import("drizzle-orm/pg-core").PgColumn<{
            name: "content";
            tableName: "job_notes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        type: import("drizzle-orm/pg-core").PgColumn<{
            name: "type";
            tableName: "job_notes";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "Customer" | "Internal";
            driverParam: string;
            notNull: true;
            hasDefault: true;
            enumValues: ["Internal", "Customer"];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "job_notes";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const usersRelations: import("drizzle-orm").Relations<"users", {
    vehicles: import("drizzle-orm").Many<"vehicles">;
    jobsAsCustomer: import("drizzle-orm").Many<"jobs">;
    jobsAsAdvisor: import("drizzle-orm").Many<"jobs">;
}>;
export declare const vehiclesRelations: import("drizzle-orm").Relations<"vehicles", {
    owner: import("drizzle-orm").One<"users", true>;
    jobs: import("drizzle-orm").Many<"jobs">;
}>;
export declare const jobsRelations: import("drizzle-orm").Relations<"jobs", {
    vehicle: import("drizzle-orm").One<"vehicles", true>;
    customer: import("drizzle-orm").One<"users", true>;
    advisor: import("drizzle-orm").One<"users", true>;
    workRecords: import("drizzle-orm").Many<"work_records">;
    notes: import("drizzle-orm").Many<"job_notes">;
}>;
export declare const workRecordsRelations: import("drizzle-orm").Relations<"work_records", {
    job: import("drizzle-orm").One<"jobs", true>;
}>;
export declare const jobNotesRelations: import("drizzle-orm").Relations<"job_notes", {
    job: import("drizzle-orm").One<"jobs", true>;
    user: import("drizzle-orm").One<"users", true>;
}>;
export declare const auditLogs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "audit_logs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "audit_logs";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "audit_logs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
        action: import("drizzle-orm/pg-core").PgColumn<{
            name: "action";
            tableName: "audit_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        resource: import("drizzle-orm/pg-core").PgColumn<{
            name: "resource";
            tableName: "audit_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        payload: import("drizzle-orm/pg-core").PgColumn<{
            name: "payload";
            tableName: "audit_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        ip: import("drizzle-orm/pg-core").PgColumn<{
            name: "ip";
            tableName: "audit_logs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "audit_logs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            enumValues: undefined;
            baseColumn: never;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const auditLogsRelations: import("drizzle-orm").Relations<"audit_logs", {
    user: import("drizzle-orm").One<"users", false>;
}>;
export type Vehicle = typeof vehicles.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type WorkRecord = typeof workRecords.$inferSelect;
export type JobNote = typeof jobNotes.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
