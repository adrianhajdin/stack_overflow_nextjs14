ALTER TABLE `question` RENAME COLUMN `votes` TO `upVotes`;--> statement-breakpoint
ALTER TABLE `question` ADD `userId` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `question` ADD `downVotes` int DEFAULT 0 NOT NULL;