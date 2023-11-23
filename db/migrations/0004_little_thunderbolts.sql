CREATE TABLE `user` (
	`id` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`userName` varchar(255) NOT NULL,
	`password` varchar(255),
	`bio` varchar(255),
	`avatar` varchar(255) NOT NULL DEFAULT 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
	`location` varchar(255),
	`portfolio` varchar(255),
	`reputation` varchar(255),
	`created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT `user_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `question` RENAME COLUMN `userId` TO `authorId`;--> statement-breakpoint
ALTER TABLE `question` ADD `answers` varchar(255);