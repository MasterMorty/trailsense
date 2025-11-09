PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `__new_nodes` (
	`id` integer PRIMARY KEY NOT NULL,
	`trail_id` integer NOT NULL,
	`status` text NOT NULL,
	`ratio` real DEFAULT 1 NOT NULL,
	`battery` real DEFAULT 0.75 NOT NULL,
	FOREIGN KEY (`trail_id`) REFERENCES `trails`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_nodes` ("id", "trail_id", "status", "ratio", "battery")
SELECT
	n."id",
	t."id" as `trail_id`,
	n."status",
	n."ratio",
	n."battery"
FROM `nodes` n
LEFT JOIN `trails` t ON t."location_id" = n."location_id";
--> statement-breakpoint
DROP TABLE `nodes`;
--> statement-breakpoint
ALTER TABLE `__new_nodes` RENAME TO `nodes`;
--> statement-breakpoint
CREATE TABLE `__new_trails` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path_data` blob
);
--> statement-breakpoint
INSERT INTO `__new_trails` ("id", "name", "path_data")
SELECT "id", "name", "path_data" FROM `trails`;
--> statement-breakpoint
DROP TABLE `trails`;
--> statement-breakpoint
ALTER TABLE `__new_trails` RENAME TO `trails`;
--> statement-breakpoint
DROP TABLE `locations`;
--> statement-breakpoint
PRAGMA foreign_keys=ON;
