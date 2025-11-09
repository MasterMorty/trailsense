PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_trails` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path_data` text,
	`latitude_start` real,
	`longitude_start` real
);
--> statement-breakpoint
INSERT INTO `__new_trails`("id", "name", "path_data", "latitude_start", "longitude_start") SELECT "id", "name", "path_data", "latitude_start", "longitude_start" FROM `trails`;--> statement-breakpoint
DROP TABLE `trails`;--> statement-breakpoint
ALTER TABLE `__new_trails` RENAME TO `trails`;--> statement-breakpoint
PRAGMA foreign_keys=ON;