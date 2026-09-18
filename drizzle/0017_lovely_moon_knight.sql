-- These production columns predate Drizzle schema tracking. IF NOT EXISTS keeps
-- this synchronization migration safe for both existing and fresh databases.
ALTER TABLE `projects` ADD COLUMN IF NOT EXISTS `twitter` varchar(500);--> statement-breakpoint
ALTER TABLE `projects` ADD COLUMN IF NOT EXISTS `github` varchar(500);--> statement-breakpoint
ALTER TABLE `projects` ADD COLUMN IF NOT EXISTS `shortDescription` varchar(500);--> statement-breakpoint
ALTER TABLE `projects` ADD COLUMN IF NOT EXISTS `tags` json;--> statement-breakpoint
ALTER TABLE `projects` ADD COLUMN IF NOT EXISTS `featured` boolean DEFAULT false;
