-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2026 at 09:28 PM
-- Server version: 10.6.25-MariaDB
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ducmo2534019_portfolio`
--

-- --------------------------------------------------------

--
-- Table structure for table `albums`
--

CREATE TABLE `albums` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `order` smallint(5) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `albums`
--

INSERT INTO `albums` (`id`, `name`, `description`, `order`) VALUES
(1, 'Web', 'Tous mes projets de développement web utilisant différents langages', 1),
(2, 'Webdesign', 'Les différents maquettes et designs réalisés avec XD et Figma', 2),
(3, 'Photoshop', 'Différents photomontages utilisant des techniques variées', 3),
(4, 'Illustrator', 'Différents logos et illustrations réalisés avec Illustrator', 4),
(5, 'Indesign', 'Mes projets textuels réalisés avec Indesign', 5),
(6, 'Premiere Pro', 'Mes différents montage vidéos réalisés avec Premiere Pro', 6),
(7, 'Procreate', 'Différents pictos réalisés à l\'aide de Procreate sur iPad', 7),
(8, 'Autres', 'Mes autres projets', 8);

-- --------------------------------------------------------

--
-- Table structure for table `covers`
--

CREATE TABLE `covers` (
  `id` int(10) UNSIGNED NOT NULL,
  `project_id` int(10) UNSIGNED NOT NULL,
  `url` varchar(500) NOT NULL,
  `order` smallint(3) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `covers`
--

INSERT INTO `covers` (`id`, `project_id`, `url`, `order`) VALUES
(73, 1, 'img/hvnv_logo_1.png', 1),
(74, 1, 'img/hvnv_logo_2.png', 2),
(75, 1, 'img/hvnv_logo_3.JPEG', 3),
(76, 2, 'img/hvnv_logo_1.png', 1),
(77, 3, 'img/hvnv_logo_1.png', 1),
(78, 4, 'img/owltime_logo_1.png', 1),
(79, 5, 'img/owltime_logo_1.png', 1),
(80, 5, 'img/owltime_logo_2.png', 2),
(81, 5, 'img/owltime_logo_3.png', 3),
(82, 5, 'img/owltime_logo_4.png', 4),
(83, 5, 'img/owltime_logo_5.png', 5),
(84, 5, 'img/owltime_logo_6.png', 6),
(85, 5, 'img/owltime_logo_7.png', 7),
(86, 6, 'img/owltime_etiquette_1.png', 1),
(87, 6, 'img/owltime_etiquette_2.png', 2),
(88, 6, 'img/owltime_etiquette_3.png', 3),
(89, 6, 'img/owltime_etiquette_4.png', 4),
(90, 6, 'img/owltime_etiquette_5.png', 5),
(91, 6, 'img/owltime_etiquette_6.png', 6),
(92, 6, 'img/owltime_etiquette_7.png', 7),
(93, 7, 'img/stupeur_tremblements.jpg', 1),
(94, 8, 'img/photo1.jpeg', 1),
(95, 8, 'img/photo2.jpeg', 2),
(96, 9, 'img/photo3.jpeg', 1),
(97, 10, 'img/photo4.png', 1),
(98, 11, 'img/photo6.png', 1),
(99, 11, 'img/photo5.jpeg', 2),
(100, 12, 'img/shizen_logo.png', 1),
(101, 12, 'img/shizen_site.jpeg', 2),
(102, 13, 'img/shizen_logo.png', 1),
(103, 13, 'img/shizen_maquette.jpeg', 2),
(104, 13, 'img/shizen_zonning.png', 3),
(105, 14, 'img/moodboard.jpeg', 1),
(106, 15, 'img/prestige1.jpg', 1),
(107, 15, 'img/prestige2.jpg', 2),
(108, 15, 'img/prestige3.jpg', 3),
(109, 15, 'img/prestige4.jpg', 4),
(110, 15, 'img/prestige5.jpg', 5),
(111, 15, 'img/prestige6.jpg', 6),
(112, 15, 'img/prestige7.jpg', 7),
(113, 15, 'img/prestige8.jpg', 8),
(114, 16, 'img/procreate1.png', 1),
(115, 16, 'img/procreate2.png', 2),
(116, 16, 'img/procreate3.png', 3),
(117, 16, 'img/procreate4.png', 4),
(118, 16, 'img/procreate5.png', 5),
(119, 16, 'img/procreate6.png', 6),
(120, 17, 'img/laufey1.jpg', 1),
(121, 17, 'img/laufey2.jpg', 2),
(122, 17, 'img/laufey3.jpg', 3),
(123, 17, 'img/laufey4.jpg', 4),
(124, 17, 'img/laufey5.jpg', 5),
(125, 17, 'img/laufey6.jpg', 6),
(126, 17, 'img/laufey7.jpg', 7),
(127, 17, 'img/laufey8.jpg', 8),
(128, 18, 'img/logo_cegep.png', 1),
(129, 18, 'img/cahier1.jpg', 2),
(130, 18, 'img/cahier2.jpg', 3),
(131, 18, 'img/cahier3.jpg', 4),
(132, 18, 'img/cahier4.jpg', 5),
(133, 18, 'img/cahier5.jpg', 6),
(134, 18, 'img/cahier6.jpg', 7),
(135, 18, 'img/cahier7.jpg', 8),
(136, 18, 'img/cahier8.jpg', 9),
(137, 18, 'img/cahier9.jpg', 10),
(138, 18, 'img/cahier10.jpg', 11),
(139, 19, 'img/logo_cegep.png', 1),
(140, 19, 'img/depliant1.jpg', 2),
(141, 19, 'img/depliant2.jpg', 3),
(142, 20, 'img/logo_cegep.png', 1),
(143, 20, 'img/carte1.jpg', 2),
(144, 20, 'img/carte2.jpg', 3);

-- --------------------------------------------------------

--
-- Table structure for table `featured_projects`
--

CREATE TABLE `featured_projects` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `gif_url` varchar(500) DEFAULT NULL,
  `order` smallint(5) UNSIGNED DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `featured_projects`
--

INSERT INTO `featured_projects` (`id`, `name`, `description`, `gif_url`, `order`) VALUES
(1, 'Owl Time', 'Ma marque de bière artisanale fictive', 'gifs/gif1.gif', 1),
(2, 'Canada', 'Mes différents projets réalisés à l\'étranger', 'gifs/gif2.gif', 2),
(3, 'Mes projets à l\'IUT', 'Mes principaux projets en études de MMI', 'gifs/gif3.gif', 3);

-- --------------------------------------------------------

--
-- Table structure for table `links`
--

CREATE TABLE `links` (
  `id` int(10) UNSIGNED NOT NULL,
  `project_id` int(10) UNSIGNED NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(500) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `links`
--

INSERT INTO `links` (`id`, `project_id`, `label`, `url`) VALUES
(7, 2, 'Publicité', 'https://youtu.be/k8CyWAxhzJE?si=sx4hjDx0eQJwKDRv'),
(8, 3, 'Site Web', 'https://but1.mmi-iutsf.org/S1/2025_S1/groupe_m/home.html'),
(9, 4, 'Site Web', 'https://but1.mmi-iutsf.org/S2/2025/owl-time/'),
(10, 4, 'Code', 'https://github.com/DestosTV/owltimebeer'),
(11, 12, 'Code', 'https://github.com/DestosTV/shizen'),
(12, 12, 'Site Web', 'https://morganduchamp.techniquesmedia.com/shizen/');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
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

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `featured_project_id`, `album_id`, `title`, `description`, `year`, `category`, `importance`, `featured`) VALUES
(1, 3, 4, 'HVNV - Logo', 'Réalisation du logo de mon association contre les discriminations des personnes handicapées', 2024, 'Logo', 80, 1),
(2, 3, 6, 'HVNV - Publicité', 'Réalisation d\'une publicité pour montrer la réalité des violences handicapées', 2024, 'Publicités', 65, 1),
(3, 3, 1, 'HVNV - Site Web', 'Mon site web réalisé pour le projet HVNV, en HTML/CSS/JS', 2024, 'Développement Web', 65, 1),
(4, 1, 1, 'Owl Time - Site Web', 'Réalisation de mon premier site web avec du PHP.', 2025, 'Développement Web', 20, 1),
(5, 1, 4, 'Owl Time - Logo', 'Réalisation du logo pour ma bière Owl Time, avec ses différentes déclinaisons en fonction des saveurs', 2025, 'Logo', 65, 1),
(6, 1, 4, 'Owl Time - Étiquettes de bouteille', 'Réalisation des étiquettes pour les bouteilles Owl Time. Différents goûts ont été réalisés, en suivant pour chacun les cultures de différents pays', 2025, 'Design', 90, 1),
(7, 3, 7, 'Stupeur & Tremblements', 'Création d\'une première de couverture pour le livre \"Stupeur & Tremblements\" d\'Amélie Nothomb', 2025, 'Créatif', 66, 1),
(8, 2, 3, 'Nuit étoilée', 'Photomontage d\'une nuit étoilée avec différentes galaxies', 2025, 'Créatif', 70, 1),
(9, 2, 3, 'Apollo, à la conquête de l\'espace - Affiche', 'Réalisation d\'une affiche pour mon film fictif sur la conquête spatiale des années 60, à l\'aide d\'images libres de droits', 2025, 'Créatif', 86, 1),
(10, 2, 3, 'Apollo, à la conquête de l\'espace - Scène', 'Réalisation d\'une des scène de mon film fictif sur la conquête spatiale des années 60, à l\'aide d\'images libres de droits', 2025, 'Créatif', 83, 1),
(11, 2, 3, 'Echoes of Aether', 'Création d\'une affiche de mon projet de jeu nommé Echoes of Aether', 2025, 'Créatif', 65, 1),
(12, 2, 1, 'Shizen - Site Web', 'Développement d\'un site web sur les temples et la culture japonaise nommé Shizen. Celui-ci fonctionne intégralement, et a été fait en PHP avec Base de Données SQL.', 2025, 'Développement Web', 90, 1),
(13, 2, 1, 'Shizen - Maquette', 'Réalisation de la maquette du site web Shizen (basse, moyenne et haute fidélité)', 2025, 'Design Web', 80, 1),
(14, 2, 4, 'Moodboard express', 'Réalisation d\'un moodboard sur le thème de la méchanique en 45 min', 2025, 'Créatif', 70, 1),
(15, 2, 5, 'Brochure Prestige', 'Création d\'une brochure prestige sur une auberge de luxe japonaise', 2025, 'Créatif', 64, 1),
(16, 2, 7, 'Pictogrammes', 'Réalisation de différents pictogrammes sur Procreate pour différents projets, avec l\'usage de différents pinceaux', 2025, 'Créatif', 60, 1),
(17, 2, 5, 'Livret', 'Création d\'un livret de 8 pages sur l\'histoire de Laufey', 2025, 'Créatif', 60, 1),
(18, 2, 5, 'Cégep de Jonquière - Cahier Interactif', 'À partir de la charte graphique du Cégep de Jonquière, réalisation d\'un cahier interactif pour présenter la formation de notre choix', 2025, 'Créatif', 75, 1),
(19, 2, 5, 'Cégep de Jonquière - Dépliant', 'Réalisation d\'un dépliant 6 volets pour présenter la formation de notre choix au Cégep de Jonquière', 2025, 'Créatif', 70, 1),
(20, 2, 5, 'Cégep de Jonquière - Carte de visite', 'Réalisation d\'une carte de visite à destination du directeur de la formation choisie', 2025, 'Créatif', 65, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `albums`
--
ALTER TABLE `albums`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `covers`
--
ALTER TABLE `covers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_covers_project` (`project_id`);

--
-- Indexes for table `featured_projects`
--
ALTER TABLE `featured_projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `links`
--
ALTER TABLE `links`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_links_project` (`project_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_projects_featured_project` (`featured_project_id`),
  ADD KEY `idx_projects_album` (`album_id`),
  ADD KEY `idx_projects_importance` (`importance`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `albums`
--
ALTER TABLE `albums`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `covers`
--
ALTER TABLE `covers`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=145;

--
-- AUTO_INCREMENT for table `featured_projects`
--
ALTER TABLE `featured_projects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `links`
--
ALTER TABLE `links`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `covers`
--
ALTER TABLE `covers`
  ADD CONSTRAINT `fk_covers_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `links`
--
ALTER TABLE `links`
  ADD CONSTRAINT `fk_links_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
