CREATE TABLE `question` (
	`id` varchar(255) NOT NULL,
	`title` varchar(130) NOT NULL,
	`tags` json NOT NULL,
	`explanation` varchar(130) NOT NULL,
	CONSTRAINT `question_id` PRIMARY KEY(`id`)
);
