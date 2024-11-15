/*
  Warnings:

  - Added the required column `catid` to the `subCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subCategory` ADD COLUMN `catid` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `subCategory` ADD CONSTRAINT `subCategory_catid_fkey` FOREIGN KEY (`catid`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
