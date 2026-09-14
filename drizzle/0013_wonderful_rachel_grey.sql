ALTER TABLE `posts` ADD `authorSlug` varchar(100);--> statement-breakpoint
ALTER TABLE `posts` ADD `authorSlug` varchar(100);--> statement-breakpoint
CREATE INDEX `posts_author_slug_idx` ON `posts` (`authorSlug`);
