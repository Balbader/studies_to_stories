CREATE TABLE `story_data` (
	`id` text PRIMARY KEY NOT NULL,
	`story_id` text NOT NULL,
	`story_data` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `subject_data` (
	`id` text PRIMARY KEY NOT NULL,
	`subject_id` text NOT NULL,
	`subject_data` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
