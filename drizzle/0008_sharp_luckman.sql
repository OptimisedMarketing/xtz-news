CREATE TABLE `tezoracle_status_import_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` varchar(128) NOT NULL,
	`payloadHash` varchar(64) NOT NULL,
	`changed` boolean NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tezoracle_status_import_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `tsid_delivery_idx` UNIQUE(`deliveryId`)
);
--> statement-breakpoint
CREATE TABLE `tezoracle_status_snapshots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceUrl` varchar(500) NOT NULL,
	`sourceHash` varchar(64) NOT NULL,
	`architectureStatus` varchar(64) NOT NULL,
	`implementationStatus` varchar(64) NOT NULL,
	`testnetStatus` varchar(64) NOT NULL,
	`productionStatus` varchar(64) NOT NULL,
	`contractAddresses` longtext NOT NULL,
	`sourceCheckedAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tezoracle_status_snapshots_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `tss_checked_idx` ON `tezoracle_status_snapshots` (`sourceCheckedAt`);--> statement-breakpoint
CREATE INDEX `tss_hash_idx` ON `tezoracle_status_snapshots` (`sourceHash`);