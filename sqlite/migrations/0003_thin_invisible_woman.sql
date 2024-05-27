CREATE TABLE `userFollows` (
	`followerId` integer NOT NULL,
	`followedId` integer NOT NULL,
	PRIMARY KEY(`followedId`, `followerId`),
	FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`followedId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
