CREATE TABLE `advertiser_enquiries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`contactName` varchar(255) NOT NULL,
	`contactEmail` varchar(320) NOT NULL,
	`companyName` varchar(255) NOT NULL,
	`websiteUrl` text,
	`placementInterest` enum('homepage_banner','article_banner','newsletter','sponsored_article','directory_feature','custom') NOT NULL,
	`campaignBrief` text NOT NULL,
	`agreedToContact` boolean NOT NULL DEFAULT false,
	`status` enum('pending','reviewed','replied','closed') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `advertiser_enquiries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `advertiser_enquiries_status_idx` ON `advertiser_enquiries` (`status`);--> statement-breakpoint
CREATE INDEX `advertiser_enquiries_created_idx` ON `advertiser_enquiries` (`createdAt`);