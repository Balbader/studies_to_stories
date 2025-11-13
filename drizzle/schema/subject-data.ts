import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const subjectDataTable = sqliteTable('subject_data', {
	id: text('id').primaryKey(),
	subject_id: text('subject_id').notNull(),
	subject_data: text('subject_data').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
});
