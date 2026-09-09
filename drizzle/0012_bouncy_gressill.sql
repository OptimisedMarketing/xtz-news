ALTER TABLE `tezos_event_candidates` ADD `eventType` enum('community','conference','meetup','workshop','exhibition','online','other') DEFAULT 'community' NOT NULL;--> statement-breakpoint
ALTER TABLE `tezos_event_candidates` ADD `eventType` enum('community','conference','meetup','workshop','exhibition','online','other') DEFAULT 'community' NOT NULL;--> statement-breakpoint
ALTER TABLE `tezos_event_candidates` ADD `submitterName` varchar(255);--> statement-breakpoint
ALTER TABLE `tezos_event_candidates` ADD `submitterEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `tezos_event_candidates` ADD `agreedToReview` boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `tezos_event_candidate_type_idx` ON `tezos_event_candidates` (`eventType`);
