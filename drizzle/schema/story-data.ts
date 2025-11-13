import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const storyDataTable = sqliteTable('story_data', {
	id: text('id').primaryKey(),
	story_id: text('story_id').notNull(),
	story_data: text('story_data').notNull(),
	created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
	updated_at: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
});
