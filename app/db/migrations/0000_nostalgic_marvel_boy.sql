CREATE TABLE `activities` (
	`id` integer PRIMARY KEY NOT NULL,
	`node_id` integer,
	`ble` integer,
	`wifi` integer,
	`temperature` real,
	`humidity` real,
	`created_at` text,
	FOREIGN KEY (`node_id`) REFERENCES `nodes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`address` text
);
--> statement-breakpoint
CREATE TABLE `nodes` (
	`id` integer PRIMARY KEY NOT NULL,
	`location_id` integer,
	`status` text NOT NULL,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `trails` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`location_id` integer,
	`path_data` blob,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
