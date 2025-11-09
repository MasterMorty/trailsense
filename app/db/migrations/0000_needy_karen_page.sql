CREATE TABLE `activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`node_id` integer NOT NULL,
	`ble` integer,
	`wifi` integer,
	`temperature` real,
	`humidity` real,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` integer PRIMARY KEY NOT NULL,
	`trail_id` integer,
	`status` text NOT NULL,
	`ratio` real DEFAULT 1 NOT NULL,
	`battery` real DEFAULT 0.75 NOT NULL,
	FOREIGN KEY (`trail_id`) REFERENCES `trails`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trails` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`path_data` blob,
	`latitude_start` real,
	`longitude_start` real
);
