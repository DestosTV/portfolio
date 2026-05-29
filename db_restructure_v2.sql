-- ============================================
-- RESTRUCTURATION DB V2 - STRUCTURE PLAYLISTS
-- ============================================
-- Style Spotify : Featured Projects (playlists) contiennent directement des projets
-- Les albums sont optionnels pour organiser les projets à l'intérieur d'une playlist

-- ============================================
-- 1. TABLE : FEATURED_PROJECTS (Les 4 "playlists" principales)
-- ============================================
CREATE TABLE `featured_projects` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `gif_url` VARCHAR(500),
  `order` INT(10) UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TABLE : ALBUMS (Thèmes/Catégories optionnels)
-- ============================================
CREATE TABLE `albums` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(200) NOT NULL,
  `description` TEXT,
  `order` INT(10) UNSIGNED DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. TABLE : PROJECTS (Projets individuels)
-- ============================================
CREATE TABLE `projects` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `featured_project_id` INT(10) UNSIGNED NOT NULL,
  `album_id` INT(10) UNSIGNED,
  `title` VARCHAR(200) NOT NULL,
  `year` SMALLINT(5) UNSIGNED NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `cover_url` VARCHAR(500) DEFAULT NULL,
  `importance` SMALLINT(5) UNSIGNED DEFAULT 0,
  `featured` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`featured_project_id`) REFERENCES `featured_projects` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`album_id`) REFERENCES `albums` (`id`) ON DELETE SET NULL,
  KEY `idx_projects_featured_project` (`featured_project_id`),
  KEY `idx_projects_year` (`year`),
  KEY `idx_projects_album` (`album_id`),
  KEY `idx_projects_importance` (`importance`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. TABLE : LINKS (Liens externes des projets)
-- ============================================
CREATE TABLE `links` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` INT(10) UNSIGNED NOT NULL,
  `label` VARCHAR(100) NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
