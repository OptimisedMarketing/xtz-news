CREATE TABLE `tezos_event_candidates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sourceKey` varchar(64) NOT NULL,
	`sourceEventId` varchar(512) NOT NULL,
	`sourceUrl` text NOT NULL,
	`title` varchar(500) NOT NULL,
	`description` text,
	`startAt` timestamp NOT NULL,
	`endAt` timestamp,
	`location` varchar(500),
	`timezone` varchar(64),
	`sourceHash` varchar(64) NOT NULL,
	`sourceCheckedAt` timestamp NOT NULL,
	`status` enum('pending','reviewed','published','rejected') NOT NULL DEFAULT 'pending',
	`eventId` int,
	`adminNotes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tezos_event_candidates_id` PRIMARY KEY(`id`),
	CONSTRAINT `tezos_event_candidate_source_idx` UNIQUE(`sourceKey`,`sourceEventId`)
);
--> statement-breakpoint
CREATE TABLE `tezos_event_import_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` varchar(128) NOT NULL,
	`payloadHash` varchar(64) NOT NULL,
	`candidateCount` int NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tezos_event_import_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `tezos_event_import_delivery_idx` UNIQUE(`deliveryId`)
);
--> statement-breakpoint
CREATE INDEX `tezos_event_candidate_status_idx` ON `tezos_event_candidates` (`status`);--> statement-breakpoint
CREATE INDEX `tezos_event_candidate_start_idx` ON `tezos_event_candidates` (`startAt`);