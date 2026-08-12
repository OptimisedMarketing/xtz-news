CREATE TABLE `user_category_follows` (
	`userId` int NOT NULL,
	`categoryId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ucf_user_category_idx` UNIQUE(`userId`,`categoryId`)
);
--> statement-breakpoint
CREATE INDEX `ucf_user_idx` ON `user_category_follows` (`userId`);--> statement-breakpoint
CREATE INDEX `ucf_category_idx` ON `user_category_follows` (`categoryId`);