CREATE TABLE `newsletter_subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`name` varchar(255),
	`status` enum('active','unsubscribed') NOT NULL DEFAULT 'active',
	`govAlerts` boolean NOT NULL DEFAULT false,
	`unsubToken` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_email_idx` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `post_translations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`locale` varchar(10) NOT NULL,
	`title` text NOT NULL,
	`slug` varchar(500) NOT NULL,
	`excerpt` text,
	`content` longtext NOT NULL,
	`metaTitle` varchar(255),
	`metaDescription` text,
	`audioUrl` text,
	`status` enum('draft','published') NOT NULL DEFAULT 'published',
	`translatedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `post_translations_id` PRIMARY KEY(`id`),
	CONSTRAINT `pt_post_locale_idx` UNIQUE(`postId`,`locale`)
);
--> statement-breakpoint
ALTER TABLE `posts` MODIFY COLUMN `seoTitle` varchar(255);--> statement-breakpoint
ALTER TABLE `posts` ADD `audioUrl` varchar(500);--> statement-breakpoint
CREATE INDEX `pt_locale_idx` ON `post_translations` (`locale`);--> statement-breakpoint
CREATE INDEX `pt_postId_idx` ON `post_translations` (`postId`);