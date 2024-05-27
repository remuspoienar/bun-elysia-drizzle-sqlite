CREATE TABLE `userFavorites` (
	`articleId` integer NOT NULL,
	`userId` integer NOT NULL,
	PRIMARY KEY(`articleId`, `userId`),
	FOREIGN KEY (`articleId`) REFERENCES `articles`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
