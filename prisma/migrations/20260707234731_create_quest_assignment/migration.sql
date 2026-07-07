-- CreateTable
CREATE TABLE `QuestAssignment` (
    `id` VARCHAR(191) NOT NULL,
    `role` ENUM('Leader', 'Support', 'Scout') NOT NULL,
    `hunterId` VARCHAR(191) NOT NULL,
    `questId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QuestAssignment` ADD CONSTRAINT `QuestAssignment_hunterId_fkey` FOREIGN KEY (`hunterId`) REFERENCES `Hunter`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QuestAssignment` ADD CONSTRAINT `QuestAssignment_questId_fkey` FOREIGN KEY (`questId`) REFERENCES `Quest`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
