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

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
