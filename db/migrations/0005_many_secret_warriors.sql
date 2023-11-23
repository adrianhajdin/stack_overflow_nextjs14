ALTER TABLE `question` MODIFY COLUMN `answers` int NOT NULL;--> statement-breakpoint
ALTER TABLE `question` MODIFY COLUMN `answers` int NOT NULL DEFAULT 0;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `reputation` int NOT NULL;--> statement-breakpoint
ALTER TABLE `user` MODIFY COLUMN `reputation` int NOT NULL DEFAULT 0;