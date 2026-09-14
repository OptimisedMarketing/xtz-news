CREATE TABLE `correction_reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reporterName` varchar(255) NOT NULL,
	`reporterEmail` varchar(320) NOT NULL,
	`articleUrl` text NOT NULL,
	`articleTitle` varchar(500),
	`correctionDetail` text NOT NULL,
	`sourceUrl` text,
	`agreedToReview` boolean NOT NULL DEFAULT false,
	`status` enum('pending','reviewed','resolved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `correction_reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `correction_reports_status_idx` ON `correction_reports` (`status`);--> statement-breakpoint
CREATE INDEX `correction_reports_created_idx` ON `correction_reports` (`createdAt`);