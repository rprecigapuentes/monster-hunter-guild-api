/*
  Warnings:

  - Made the column `rank` on table `hunter` required. This step will fail if there are existing NULL values in that column.
  - Made the column `experiencePoints` on table `hunter` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `hunter` MODIFY `rank` INTEGER NOT NULL DEFAULT 1,
    MODIFY `experiencePoints` INTEGER NOT NULL DEFAULT 0;
