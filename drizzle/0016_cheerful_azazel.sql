CREATE TABLE `referral_copy_metrics` (
	`day` varchar(10) NOT NULL,
	`copyCount` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referral_copy_metrics_day` PRIMARY KEY(`day`)
);
--> statement-breakpoint
CREATE INDEX `referral_copy_metrics_updated_idx` ON `referral_copy_metrics` (`updatedAt`);