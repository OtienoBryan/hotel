/*
  Warnings:

  - A unique constraint covering the columns `[tableNo]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `tableNo` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `user_tableNo_key` ON `user`(`tableNo`);
