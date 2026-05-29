-- ============================================
-- DONNÉES DE TEST - VERSION 2 + STRUCTURE
-- ============================================
-- Création complète de la base de données avec données de test

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- ============================================
-- CRÉATION DES TABLES
-- ============================================

-- 1. Table featured_projects (4 grandes catégories)
CREATE TABLE IF NOT EXISTS `featured_projects` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `gif_url` varchar(500) DEFAULT NULL,
  `order` smallint(5) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `featured_projects`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `featured_projects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- 2. Table albums (Thèmes optionnels)
CREATE TABLE IF NOT EXISTS `albums` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `order` smallint(5) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

ALTER TABLE `albums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- 3. Table projects (Projets individuels)
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(10) UNSIGNED NOT NULL,
  `featured_project_id` int(10) UNSIGNED NOT NULL,
  `album_id` int(10) UNSIGNED DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `year` smallint(5) UNSIGNED NOT NULL,
  `category` varchar(100) NOT NULL,
  `importance` smallint(5) UNSIGNED DEFAULT 0,
  `featured` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_projects_featured_project` (`featured_project_id`),
  ADD KEY `idx_projects_album` (`album_id`),
  ADD KEY `idx_projects_importance` (`importance`);

ALTER TABLE `projects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- 4. Table covers (Images multiples par projet)
CREATE TABLE IF NOT EXISTS `covers` (
  `id` int(10) UNSIGNED NOT NULL,
  `project_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(500) NOT NULL,
  `order` smallint(3) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `covers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_covers_project` (`project_id`),
  ADD CONSTRAINT `fk_covers_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

ALTER TABLE `covers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

-- 5. Table links (Liens vers live, github, etc.)
CREATE TABLE IF NOT EXISTS `links` (
  `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` int(10) UNSIGNED NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_links_project` (`project_id`),
  CONSTRAINT `fk_links_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- NETTOYAGE DES DONNÉES
-- ============================================
DELETE FROM links;
DELETE FROM covers;
DELETE FROM projects;
DELETE FROM albums;
DELETE FROM featured_projects;

-- 2. REMPLIR LES FEATURED_PROJECTS (4 playlists)
INSERT INTO featured_projects (id, name, description, gif_url, `order`) VALUES
(1, 'Owl Time', 'Mes premiers projets web et explorations créatives', 'gifs/gif1.gif', 1),
(2, 'Première année', 'Projets réalisés durant ma première année d\'études', 'gifs/gif2.gif', 2),
(3, 'Canada', 'Expérience au Canada et apprentissages', 'gifs/gif3.gif', 3),
(4, 'Projets divers', 'Autres projets et expérimentations', 'gifs/gif4.gif', 4);

-- 3. REMPLIR LES ALBUMS (Thèmes optionnels)
INSERT INTO albums (id, name, description, `order`) VALUES
(1, 'Web Design', 'Projets de design web et UX', 1),
(2, 'Interface', 'Interfaces et prototypage', 2),
(3, 'HTML/CSS', 'Fondamentaux du web', 3),
(4, 'JavaScript', 'Développement front-end dynamique', 4),
(5, 'Stage', 'Projet de stage professionnel', 5),
(6, 'Expérimentations', 'Découvertes et test de nouvelles technologies', 6),
(7, 'Outils', 'Petits outils utiles', 7),
(8, 'Jeux', 'Mini-jeux et projets ludiques', 8);

-- 4. REMPLIR LES PROJECTS

-- Owl Time - Projets mélangés
INSERT INTO projects (id, featured_project_id, album_id, title, description, year, category, importance, featured) VALUES
(1, 1, 1, 'Portfolio Initial', 'Mon premier portfolio personnel avec scrollytelling', 2023, 'Web', 85, 1),
(2, 1, 1, 'Startup Landing', 'Landing page moderne pour startup fictive', 2023, 'Web', 80, 0),
(3, 1, 2, 'Design System', 'Système de design réutilisable', 2023, 'Design', 78, 0),
(4, 1, 2, 'Prototype App', 'Prototype haute-fidélité d\'application mobile', 2023, 'Design', 75, 0),
(5, 1, NULL, 'Expérience CSS', 'Expérience interactive pure CSS', 2023, 'Créatif', 72, 0),
(6, 1, NULL, 'Composant Web', 'Web component réutilisable', 2023, 'Tech', 70, 0);

-- Première année
INSERT INTO projects (id, featured_project_id, album_id, title, description, year, category, importance, featured) VALUES
(7, 2, 3, 'Responsive Website', 'Site responsive avec techniques CSS modernes', 2023, 'Web', 72, 0),
(8, 2, 3, 'CSS Art', 'Créations artistiques en pur CSS', 2023, 'Créatif', 68, 0),
(9, 2, 4, 'Todo App', 'Application Todo avec localStorage', 2023, 'Web', 76, 0),
(10, 2, 4, 'Weather Widget', 'Widget météo avec API externe', 2024, 'Web', 74, 0),
(11, 2, NULL, 'Quiz Game', 'Jeu de quiz interactif', 2023, 'Jeu', 70, 0);

-- Canada
INSERT INTO projects (id, featured_project_id, album_id, title, description, year, category, importance, featured) VALUES
(12, 3, 5, 'Plateforme Éducative', 'Développement d\'une plateforme e-learning', 2024, 'Produit', 88, 1),
(13, 3, 5, 'Dashboard Analytics', 'Dashboard d\'analyse de données', 2024, 'Data', 82, 0),
(14, 3, 6, 'WebGL Experience', 'Expérience visuelle avec WebGL', 2024, 'Créatif', 79, 0),
(15, 3, 6, 'API REST', 'Construction d\'une API REST robuste', 2024, 'Tech', 80, 0),
(16, 3, NULL, 'Motion Design', 'Animation et motion graphics', 2024, 'Créatif', 75, 0);

-- Projets divers
INSERT INTO projects (id, featured_project_id, album_id, title, description, year, category, importance, featured) VALUES
(17, 4, 7, 'Generateur Couleurs', 'Générateur de palettes de couleurs', 2024, 'Outil', 70, 0),
(18, 4, 7, 'Markdown Editor', 'Éditeur Markdown temps réel', 2024, 'Outil', 73, 0),
(19, 4, 8, 'Snake Game', 'Implémentation moderne du jeu Snake', 2024, 'Jeu', 65, 0),
(20, 4, 8, 'Puzzle 2048', 'Réinterprétation du jeu 2048', 2024, 'Jeu', 64, 0),
(21, 4, NULL, 'Chrome Extension', 'Extension de productivité pour Chrome', 2024, 'Tech', 72, 0);

-- 5. AJOUTER LES IMAGES DE TEST (Galerie)
-- Test avec 3 images fictives pour le projet ID 1
INSERT INTO covers (project_id, url, `order`) VALUES
(1, 'https://placehold.co/600x600/FF6B6B/FFFFFF?text=Portfolio+V1', 1),
(1, 'https://placehold.co/600x600/4ECDC4/FFFFFF?text=Portfolio+Mobile', 2),
(1, 'https://placehold.co/600x600/45B7D1/FFFFFF?text=Portfolio+Detail', 3);

-- 6. AJOUTER LES LIENS
INSERT INTO links (project_id, label, url) VALUES
(1, 'Live', 'https://portfolio-v1.example.com'),
(1, 'Code', 'https://github.com/you/portfolio-v1'),
(2, 'Live', 'https://startup-landing.example.com'),
(12, 'Live', 'https://elearning.example.com'),
(12, 'Case Study', 'https://blog.example.com/elearning'),
(13, 'Live', 'https://dashboard.example.com'),
(15, 'Code', 'https://github.com/you/api-rest'),
(17, 'Live', 'https://colors.example.com'),
(18, 'Live', 'https://markdown.example.com');

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT COUNT(*) as featured_projects FROM featured_projects;
SELECT COUNT(*) as albums FROM albums;
SELECT COUNT(*) as projects FROM projects;
SELECT COUNT(*) as covers FROM covers;
SELECT COUNT(*) as links FROM links;

-- Structure hiérarchique
SELECT 
  fp.name as featured_project,
  a.name as album,
  p.title as project,
  p.year,
  p.category
FROM featured_projects fp
LEFT JOIN projects p ON fp.id = p.featured_project_id
LEFT JOIN albums a ON p.album_id = a.id
ORDER BY fp.`order`, a.`order`, p.importance DESC;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
