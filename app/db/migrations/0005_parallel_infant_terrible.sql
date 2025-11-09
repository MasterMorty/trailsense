PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_nodes` (
	`id` integer PRIMARY KEY NOT NULL,
	`location_id` integer,
	`status` text NOT NULL,
	`ratio` real DEFAULT 1 NOT NULL,
	`battery` real DEFAULT 0.75 NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_nodes`("id", "location_id", "status", "ratio", "battery") SELECT "id", "location_id", "status", "ratio", "battery" FROM `nodes`;--> statement-breakpoint
DROP TABLE `nodes`;--> statement-breakpoint
ALTER TABLE `__new_nodes` RENAME TO `nodes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_trails` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location_id` integer,
	`path_data` blob,
	`latitude_start` real,
	`longitude_start` real,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_trails`("id", "name", "location_id", "path_data", "latitude_start", "longitude_start") SELECT "id", "name", "location_id", "path_data", "latitude_start", "longitude_start" FROM `trails`;--> statement-breakpoint
DROP TABLE `trails`;--> statement-breakpoint
ALTER TABLE `__new_trails` RENAME TO `trails`;