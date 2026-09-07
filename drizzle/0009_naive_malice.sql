CREATE TABLE `newsletter_monthly_digest_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`subscriberId` int NOT NULL,
	`digestPeriod` varchar(7) NOT NULL,
	`resendEmailId` varchar(255),
	`sentAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_monthly_digest_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_monthly_digest_subscriber_period_idx` UNIQUE(`subscriberId`,`digestPeriod`)
);
--> statement-breakpoint
CREATE INDEX `newsletter_monthly_digest_period_idx` ON `newsletter_monthly_digest_deliveries` (`digestPeriod`);