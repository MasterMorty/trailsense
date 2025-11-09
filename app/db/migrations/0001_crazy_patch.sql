PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`node_id` integer NOT NULL,
	`ble` integer,
	`wifi` integer,
	`temperature` real,
	`humidity` real,
	`created_at` text DEFAULT 'CURRENT_TIMESTAMP' NOT NULL,
	FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_activities`("id", "node_id", "ble", "wifi", "temperature", "humidity", "created_at") SELECT "id", "node_id", "ble", "wifi", "temperature", "humidity", "created_at" FROM `activities`;--> statement-breakpoint
DROP TABLE `activities`;--> statement-breakpoint
ALTER TABLE `__new_activities` RENAME TO `activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;