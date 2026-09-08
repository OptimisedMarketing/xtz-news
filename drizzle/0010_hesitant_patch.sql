CREATE TABLE `art_project_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submitterName` varchar(255) NOT NULL,
	`submitterEmail` varchar(320) NOT NULL,
	`submitterType` enum('artist','gallery','collective','other') NOT NULL,
	`projectName` varchar(500) NOT NULL,
	`projectType` enum('exhibition','marketplace','creator_tool','other') NOT NULL,
	`websiteUrl` text NOT NULL,
	`description` text NOT NULL,
	`agreedToReview` boolean NOT NULL DEFAULT false,
	`status` enum('pending','reviewed','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `art_project_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `art_project_submissions_status_idx` ON `art_project_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `art_project_submissions_created_idx` ON `art_project_submissions` (`createdAt`);