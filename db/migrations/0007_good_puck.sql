CREATE TABLE `questionToTags` (
	`questionId` varchar(255) NOT NULL,
	`tagId` varchar(255) NOT NULL
);
--> statement-breakpoint
ALTER TABLE `question` DROP COLUMN `tags`;