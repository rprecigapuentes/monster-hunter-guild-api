-- Desactivar temporalmente la verificación de claves foráneas para limpiar de forma segura
SET FOREIGN_KEY_CHECKS = 0;

-- Limpiar datos previos
TRUNCATE TABLE `QuestAssignment`;
TRUNCATE TABLE `Quest`;
TRUNCATE TABLE `Hunter`;
TRUNCATE TABLE `Monster`;
TRUNCATE TABLE `Guild`;

SET FOREIGN_KEY_CHECKS = 1;

-- ==========================================
-- 1. SEED DE LA TABLA: Guild
-- ==========================================
INSERT INTO `Guild` (`id`, `name`, `region`, `headquarters`) VALUES
('g-uuid-0001', 'Silver Wing Alliance', 'Ancient Forest', 'Astera Outpost'),
('g-uuid-0002', 'Shadow Syndicate', 'Rotten Vale', 'Shadow Keep Citadel'),
('g-uuid-0003', 'Dragon Slayers Brotherhood', 'Elder\'s Recess', 'Dragon Spire'),
('g-uuid-0004', 'Golden Dawn Knights', 'Wildspire Waste', 'Desert Fortress'),
('g-uuid-0005', 'Silver Knight Order', 'Coral Highlands', 'Highland Academy');

-- ==========================================
-- 2. SEED DE LA TABLA: Monster
-- ==========================================
INSERT INTO `Monster` (`id`, `name`, `species`, `dangerLevel`, `rewardValue`) VALUES
('m-uuid-0001', 'Rathalos', 'Flying Wyvern', 5, 1500),
('m-uuid-0002', 'Nergigante', 'Elder Dragon', 8, 5000),
('m-uuid-0003', 'Tobi-Kadachi', 'Fanged Wyvern', 3, 800),
('m-uuid-0004', 'Kushala Daora', 'Elder Dragon', 8, 4500),
('m-uuid-0005', 'Rathian', 'Flying Wyvern', 4, 1200);

-- ==========================================
-- 3. SEED DE LA TABLA: Hunter
-- (Relacionado con Guild)
-- ==========================================
INSERT INTO `Hunter` (`id`, `name`, `rank`, `experiencePoints`, `guildId`) VALUES
('h-uuid-0001', 'Aiden (Silver Sword)', 12, 15000, 'g-uuid-0001'),
('h-uuid-0002', 'Shadow Hunter Jack', 25, 55000, 'g-uuid-0002'),
('h-uuid-0003', 'Eldrin Dragonbane', 50, 120000, 'g-uuid-0003'),
('h-uuid-0004', 'Lumina Silver', 5, 2000, 'g-uuid-0005'),
('h-uuid-0005', 'Zephyr Rath-Slayer', 18, 32000, 'g-uuid-0004');

-- ==========================================
-- 4. SEED DE LA TABLA: Quest
-- (Relacionado con Monster. Los estados usan el Enum QuestStatus)
-- ==========================================
INSERT INTO `Quest` (`id`, `title`, `location`, `reward`, `status`, `monsterId`) VALUES
('q-uuid-0001', 'The Silver Wyvern Menace', 'Ancient Forest', 2000, 'PENDING', 'm-uuid-0001'),
('q-uuid-0002', 'Slaying the Elder Dragon', 'Elder\'s Recess', 8000, 'IN_PROGRESS', 'm-uuid-0002'),
('q-uuid-0003', 'Shadows in the Forest', 'Wildspire Waste', 1500, 'COMPLETED', 'm-uuid-0003'),
('q-uuid-0004', 'Stormy Dragon Flight', 'Coral Highlands', 6000, 'FAILED', 'm-uuid-0004'),
('q-uuid-0005', 'Rathian Queen\'s Wrath', 'Ancient Forest', 2500, 'PENDING', 'm-uuid-0005');