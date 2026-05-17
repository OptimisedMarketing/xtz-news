CREATE TABLE `article_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255),
	`email` varchar(320),
	`articleTitle` varchar(500),
	`articleFileUrl` text,
	`articleFileKey` text,
	`bannerImageUrl` text,
	`bannerImageKey` text,
	`image2Url` text,
	`image2Key` text,
	`agreedToTerms` boolean NOT NULL DEFAULT false,
	`status` enum('pending','reviewed','approved','rejected') NOT NULL DEFAULT 'pending',
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `article_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`description` text,
	`parentId` int,
	`postCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` longtext,
	`excerpt` text,
	`featuredImageUrl` text,
	`status` enum('publish','draft') NOT NULL DEFAULT 'publish',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `events_id` PRIMARY KEY(`id`),
	CONSTRAINT `events_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` longtext,
	`featuredImageUrl` text,
	`status` enum('publish','draft') NOT NULL DEFAULT 'publish',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `pages_id` PRIMARY KEY(`id`),
	CONSTRAINT `pages_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `post_categories` (
	`postId` int NOT NULL,
	`categoryId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `post_tags` (
	`postId` int NOT NULL,
	`tagId` int NOT NULL
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` longtext,
	`excerpt` text,
	`featuredImageUrl` text,
	`featuredImageAlt` text,
	`status` enum('publish','draft','private') NOT NULL DEFAULT 'publish',
	`isFeatured` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`seoTitle` varchar(500),
	`seoDescription` text,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`),
	CONSTRAINT `posts_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`title` varchar(500) NOT NULL,
	`slug` varchar(500) NOT NULL,
	`content` longtext,
	`excerpt` text,
	`featuredImageUrl` text,
	`featuredImageAlt` text,
	`category` varchar(100),
	`websiteUrl` text,
	`status` enum('publish','draft') NOT NULL DEFAULT 'publish',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `projects_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`key` varchar(255) NOT NULL,
	`value` longtext,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `site_settings_id` PRIMARY KEY(`id`),
	CONSTRAINT `site_settings_key_unique` UNIQUE(`key`)
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`wpId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`postCount` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `tags_slug_idx` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE INDEX `pc_post_idx` ON `post_categories` (`postId`);--> statement-breakpoint
CREATE INDEX `pc_cat_idx` ON `post_categories` (`categoryId`);--> statement-breakpoint
CREATE INDEX `pt_post_idx` ON `post_tags` (`postId`);--> statement-breakpoint
CREATE INDEX `pt_tag_idx` ON `post_tags` (`tagId`);--> statement-breakpoint
CREATE INDEX `posts_status_idx` ON `posts` (`status`);--> statement-breakpoint
CREATE INDEX `posts_published_idx` ON `posts` (`publishedAt`);--> statement-breakpoint
CREATE INDEX `posts_featured_idx` ON `posts` (`isFeatured`);