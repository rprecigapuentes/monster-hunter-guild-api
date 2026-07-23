/*
  Warnings:

  - You are about to drop the `auditlog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `questassignment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `hunter` DROP FOREIGN KEY `Hunter_guildId_fkey`;

-- DropForeignKey
ALTER TABLE `quest` DROP FOREIGN KEY `Quest_monsterId_fkey`;

-- DropForeignKey
ALTER TABLE `questassignment` DROP FOREIGN KEY `QuestAssignment_hunterId_fkey`;

-- DropForeignKey
ALTER TABLE `questassignment` DROP FOREIGN KEY `QuestAssignment_questId_fkey`;

-- DropTable
DROP TABLE `auditlog`;

-- DropTable
DROP TABLE `questassignment`;

-- CreateTable
CREATE TABLE `quest_assignment` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('Leader', 'Support', 'Scout') NOT NULL,
    `hunterId` VARCHAR(191) NOT NULL,
    `questId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` VARCHAR(191) NOT NULL,
    `operation` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `hunter` ADD CONSTRAINT `hunter_guildId_fkey` FOREIGN KEY (`guildId`) REFERENCES `guild`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest` ADD CONSTRAINT `quest_monsterId_fkey` FOREIGN KEY (`monsterId`) REFERENCES `monster`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_assignment` ADD CONSTRAINT `quest_assignment_hunterId_fkey` FOREIGN KEY (`hunterId`) REFERENCES `hunter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quest_assignment` ADD CONSTRAINT `quest_assignment_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
