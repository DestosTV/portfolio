-- ============================================
-- DONNÉES PERSONNALISÉES - TEMPLATE
-- ============================================
-- Instructions:
-- 1. Remplir d'abord les 4 FEATURED_PROJECTS (tes grandes catégories)
-- 2. Puis les ALBUMS (thèmes optionnels)
-- 3. Puis les PROJECTS (tes projets individuels)
-- 4. Enfin les LINKS (liens live, github, etc.)

-- ============================================
-- ÉTAPE 1: SUPPRIMER LES ANCIENNES DONNÉES
-- ============================================
DELETE FROM links;
DELETE FROM covers;
DELETE FROM projects;
DELETE FROM albums;
DELETE FROM featured_projects;

-- ============================================
-- ÉTAPE 2: TES 4 GRANDS PROJETS
-- ============================================
-- À remplir avec tes 4 catégories principales
INSERT INTO featured_projects (id, name, description, gif_url, `order`) VALUES
(1, 'Owl Time', 'Ma marque de bière artisanale fictive', 'gifs/gif1.gif', 1),
(2, 'Canada', "Mes différents projets réalisés à l'étranger", 'gifs/gif2.gif', 2),
(3, "Mes projets à l'IUT", "Mes principaux projets en études de MMI", 'gifs/gif3.gif', 3);

-- ============================================
-- ÉTAPE 3: LES ALBUMS (OPTIONNEL)
-- ============================================
-- À remplir avec tes thèmes/regroupements
INSERT INTO albums (id, name, description, `order`) VALUES
(1, 'Web', 'Tous mes projets de développement web utilisant différents langages', 1),
(2, 'Webdesign', 'Les différents maquettes et designs réalisés avec XD et Figma', 2),
(3, 'Photoshop', 'Différents photomontages utilisant des techniques variées', 3),
(4, 'Illustrator', 'Différents logos et illustrations réalisés avec Illustrator', 4),
(5, 'Indesign', 'Mes projets textuels réalisés avec Indesign', 5),
(6, 'Premiere Pro', 'Mes différents montage vidéos réalisés avec Premiere Pro', 6),
(7, 'Procreate', "Différents pictos réalisés à l'aide de Procreate sur iPad", 7),
(8, 'Autres', "Mes autres projets", 8);


-- ============================================
-- ÉTAPE 4: TES PROJETS
-- ============================================
-- FORMAT: (id, featured_project_id, album_id, title, description, year, category, importance, featured)
-- - featured_project_id: 1, 2, 3 ou 4 (OBLIGATOIRE - auquel des 4 grands projets)
-- - album_id: 1, 2, 3 ou NULL (OPTIONNEL - thème/regroupement structuré, ex: "Web", "Webdesign")
-- - category: texte libre (ex: "Web", "Design", "Créatif") - utilisé dans le filtre "Par catégorie" en bas de l'accueil
-- - importance: 0-100 (pour trier)
-- - featured: 1 ou 0 (optionnel - seulement si tu veux mettre en avant certains projets en bas)
-- Note: Les images sont maintenant dans la table COVERS (ÉTAPE 5)

INSERT INTO projects (id, featured_project_id, album_id, title, description, year, category, importance, featured) VALUES
(1, 3, 4, 'HVNV - Logo', 'Réalisation du logo de mon association contre les discriminations des personnes handicapées', 2024, 'Logo', 80, 1),
(2, 3, 6, 'HVNV - Publicité', "Réalisation d'une publicité pour montrer la réalité des violences handicapées", 2024, 'Publicités', 65, 1),
(3, 3, 1, 'HVNV - Site Web', 'Mon site web réalisé pour le projet HVNV, en HTML/CSS/JS', 2024, 'Développement Web', 65, 1),
(4, 1, 1, 'Owl Time - Site Web', "Réalisation de mon premier site web avec du PHP.", 2025, 'Web', 20, 1),
(5, 1, 4, 'Owl Time - Logo', 'Réalisation du logo pour ma bière Owl Time, avec ses différentes déclinaisons en fonction des saveurs', 2025, 'Logo', 65, 1),
(6, 1, 4, 'Owl Time - Étiquettes de bouteille', 'Réalisation des étiquettes pour les bouteilles Owl Time. Différents goûts ont été réalisés, en suivant pour chacun les cultures de différents pays', 2025, 'Design', 90, 1),
(7, 3, 7, 'Stupeur & Tremblements', "Création d'une première de couverture pour le livre \"Stupeur & Tremblements\" d'Amélie Nothomb", 2025, 'Créatif', 66, 1),
(8, 2, 3, 'Nuit étoilée', "Photomontage d'une nuit étoilée avec différentes galaxies", 2025, 'Créatif', 70, 1),
(9, 2, 3, "Apollo, à la conquête de l'espace - Affiche", "Réalisation d'une affiche pour mon film fictif sur la conquête spatiale des années 60, à l'aide d'images libres de droits", 2025, 'Créatif', 86, 1),
(10, 2, 3, "Apollo, à la conquête de l'espace - Scène", "Réalisation d'une des scène de mon film fictif sur la conquête spatiale des années 60, à l'aide d'images libres de droits", 2025, 'Créatif', 83, 1),
(11, 2, 3, 'Echoes of Aether', "Création d'une affiche de mon projet de jeu nommé Echoes of Aether", 2025, 'Créatif', 65, 1),
(12, 2, 1, 'Shizen - Site Web', "Développement d'un site web sur les temples et la culture japonaise nommé Shizen. Celui-ci fonctionne intégralement, et a été fait en PHP avec Base de Données SQL.", 2025, 'Développement Web', 90, 1),
(13, 2, 1, 'Shizen - Maquette', "Réalisation de la maquette du site web Shizen (basse, moyenne et haute fidélité)", 2025, 'Design Web', 80, 1),
(14, 2, 4, 'Moodboard express', "Réalisation d'un moodboard sur le thème de la méchanique en 45 min", 2025, 'Créatif', 70, 1),
(15, 2, 5, 'Brochure Prestige', "Création d'une brochure prestige sur une auberge de luxe japonaise", 2025, 'Créatif', 64, 1),
(16, 2, 7, 'Pictogrammes', "Réalisation de différents pictogrammes sur Procreate pour différents projets, avec l'usage de différents pinceaux", 2025, 'Créatif', 60, 1),
(17, 2, 5, 'Livret', "Création d'un livret de 8 pages sur l'histoire de Laufey", 2025, 'Créatif', 60, 1),
(18, 2, 5, 'Cégep de Jonquière - Cahier Interactif', "À partir de la charte graphique du Cégep de Jonquière, réalisation d'un cahier interactif pour présenter la formation de notre choix", 2025, 'Créatif', 75, 1),
(19, 2, 5, 'Cégep de Jonquière - Dépliant', "Réalisation d'un dépliant 6 volets pour présenter la formation de notre choix au Cégep de Jonquière", 2025, 'Créatif', 70, 1),
(20, 2, 5, 'Cégep de Jonquière - Carte de visite', "Réalisation d'une carte de visite à destination du directeur de la formation choisie", 2025, 'Créatif', 65, 1);


-- ============================================
-- ÉTAPE 5: LES IMAGES DES PROJETS (OPTIONNEL)
-- ============================================
-- Tu peux ajouter PLUSIEURS images par projet avec des numéros d'ordre différents
-- FORMAT: (project_id, url, order)
-- TEST: Images fictives pour le projet ID 1 (HVNV - Logo)
INSERT INTO covers (project_id, url, `order`) VALUES
(1, 'img/hvnv_logo_1.png', 1),
(1, 'img/hvnv_logo_2.png', 2),
(1, 'img/hvnv_logo_3.JPEG', 3),
(2, 'img/hvnv_logo_1.png', 1),
(3, 'img/hvnv_logo_1.png', 1),
(4, 'img/owltime_logo_1.png', 1),
(5, 'img/owltime_logo_1.png', 1),
(5, 'img/owltime_logo_2.png', 2),
(5, 'img/owltime_logo_3.png', 3),
(5, 'img/owltime_logo_4.png', 4),
(5, 'img/owltime_logo_5.png', 5),
(5, 'img/owltime_logo_6.png', 6),
(5, 'img/owltime_logo_7.png', 7),
(6, 'img/owltime_etiquette_1.png', 1),
(6, 'img/owltime_etiquette_2.png', 2),
(6, 'img/owltime_etiquette_3.png', 3),
(6, 'img/owltime_etiquette_4.png', 4),
(6, 'img/owltime_etiquette_5.png', 5),
(6, 'img/owltime_etiquette_6.png', 6),
(6, 'img/owltime_etiquette_7.png', 7),
(7, 'img/stupeur_tremblements.jpg', 1),
(8, 'img/photo1.jpeg', 1),
(8, 'img/photo2.jpeg', 2),
(9, 'img/photo3.jpeg', 1),
(10, 'img/photo4.png', 1),
(11, 'img/photo6.png', 1),
(11, 'img/photo5.jpeg', 2),
(12, 'img/shizen_logo.png', 1),
(12, 'img/shizen_site.jpeg', 2),
(13, 'img/shizen_logo.png', 1),
(13, 'img/shizen_maquette.jpeg', 2),
(13, 'img/shizen_zonning.png', 3),
(14, 'img/moodboard.jpeg', 1),
(15, 'img/prestige1.jpg', 1),
(15, 'img/prestige2.jpg', 2),
(15, 'img/prestige3.jpg', 3),
(15, 'img/prestige4.jpg', 4),
(15, 'img/prestige5.jpg', 5),
(15, 'img/prestige6.jpg', 6),
(15, 'img/prestige7.jpg', 7),
(15, 'img/prestige8.jpg', 8),
(16, 'img/procreate1.png', 1),
(16, 'img/procreate2.png', 2),
(16, 'img/procreate3.png', 3),
(16, 'img/procreate4.png', 4),
(16, 'img/procreate5.png', 5),
(16, 'img/procreate6.png', 6),
(17, 'img/laufey1.jpg', 1),
(17, 'img/laufey2.jpg', 2),
(17, 'img/laufey3.jpg', 3),
(17, 'img/laufey4.jpg', 4),
(17, 'img/laufey5.jpg', 5),
(17, 'img/laufey6.jpg', 6),
(17, 'img/laufey7.jpg', 7),
(17, 'img/laufey8.jpg', 8),
(18, 'img/logo_cegep.png', 1),
(18, 'img/cahier1.jpg', 2),
(18, 'img/cahier2.jpg', 3),
(18, 'img/cahier3.jpg', 4),
(18, 'img/cahier4.jpg', 5),
(18, 'img/cahier5.jpg', 6),
(18, 'img/cahier6.jpg', 7),
(18, 'img/cahier7.jpg', 8),
(18, 'img/cahier8.jpg', 9),
(18, 'img/cahier9.jpg', 10),
(18, 'img/cahier10.jpg', 11),
(19, 'img/logo_cegep.png', 1),
(19, 'img/depliant1.jpg', 2),
(19, 'img/depliant2.jpg', 3),
(20, 'img/logo_cegep.png', 1),
(20, 'img/carte1.jpg', 2),
(20, 'img/carte2.jpg', 3);

-- Ajoute d'autres images ici au format:
-- (project_id, 'img/nom-image.jpg', order),
-- (project_id, 'img/nom-image2.jpg', order);

-- ============================================
-- ÉTAPE 6: LES LIENS (OPTIONNEL)
-- ============================================
-- Pour chaque projet, ajoute ses liens (Live, Code, Case Study, etc.)
INSERT INTO links (project_id, label, url) VALUES
(2, 'Publicité', 'https://youtu.be/k8CyWAxhzJE?si=sx4hjDx0eQJwKDRv'),
(3, 'Site Web', 'https://but1.mmi-iutsf.org/S1/2025_S1/groupe_m/home.html'),
(4, 'Site Web', 'https://but1.mmi-iutsf.org/S2/2025/owl-time/'),
(4, 'Code', 'https://github.com/DestosTV/owltimebeer'),
(12, 'Code', 'https://github.com/DestosTV/shizen'),
(12, 'Site Web', 'https://morganduchamp.techniquesmedia.com/shizen/');

-- ============================================
-- VÉRIFICATION
-- ============================================
SELECT COUNT(*) as featured_projects FROM featured_projects;
SELECT COUNT(*) as albums FROM albums;
SELECT COUNT(*) as projects FROM projects;
SELECT COUNT(*) as links FROM links;
