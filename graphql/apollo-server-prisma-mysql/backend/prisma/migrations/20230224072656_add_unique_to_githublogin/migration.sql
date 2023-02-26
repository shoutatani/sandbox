/*
  Warnings:

  - A unique constraint covering the columns `[githubLogin]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `users_githubLogin_key` ON `users`(`githubLogin`);
