CREATE TABLE `translation_import_deliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`deliveryId` varchar(128) NOT NULL,
	`payloadHash` varchar(64) NOT NULL,
	`importedCount` int NOT NULL,
	`receivedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `translation_import_deliveries_id` PRIMARY KEY(`id`),
	CONSTRAINT `tid_delivery_idx` UNIQUE(`deliveryId`)
);
