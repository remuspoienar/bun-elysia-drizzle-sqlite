CREATE TABLE `comments` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`authorId` integer NOT NULL,
	`articleId` integer NOT NULL,
	`body` text NOT NULL,
	`createdAt` datetime DEFAULT (current_timestamp) NOT NULL,
	`updatedAt` datetime DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tagsArticles` (
	`tagId` integer NOT NULL,
	`articleId` integer NOT NULL,
	PRIMARY KEY(`articleId`, `tagId`),
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `comments_id_unique` ON `comments` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_id_unique` ON `tags` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);