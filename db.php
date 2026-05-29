<?php

/*
============================================================
 Fichier de gestion des données projets (Portfolio)
============================================================
 - Connexion à la base MySQL
 - Support double : production et local (XAMPP)
 - Fallback local si la base est indisponible
 - Extraction des catégories et années
*/

// === CONFIGURATION LOCALE (XAMPP) ===
define('DB_NAME', 'portfolio');
define('DB_USER', 'root');
define('DB_PASSWORD', '');
define('DB_HOST', 'localhost');
define('DB_CHARSET', 'utf8mb4');

// === Détection automatique : production ou local ===
$isLocal = (strpos($_SERVER['HTTP_HOST'] ?? 'localhost', 'localhost') !== false) || 
           (strpos($_SERVER['HTTP_HOST'] ?? 'localhost', '127.0.0.1') !== false);

// === Paramètres de connexion à la base de données ===
if ($isLocal) {
  // Utilise la configuration locale définie ci-dessus
  define('DB_DSN', 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET);
  define('DB_USER_FINAL', DB_USER);
  define('DB_PASS_FINAL', DB_PASSWORD);
} else {
  // Configuration production (en ligne)
  define('DB_DSN', 'mysql:host=localhost;dbname=ducmo2534019_portfolio;charset=utf8mb4');
  define('DB_USER_FINAL', 'ducmo2534019_portfolio');
  define('DB_PASS_FINAL', '7d7LDFxKkdVexFH2FSWS');
}

/**
------------------------------------------------------------
 getProjects()
------------------------------------------------------------
 Récupère la liste des projets depuis la base de données.
 - Jointure sur albums et liens
 - Fallback local si la base est inaccessible
 - Tri par importance puis année
 Retourne : tableau associatif de projets
 */
function getProjects()
{
  $projects = [];

  try {
    // Connexion PDO avec gestion des erreurs et fetch associatif
    $pdo = new PDO(DB_DSN, DB_USER_FINAL, DB_PASS_FINAL, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    // Récupération des projets et albums associés
    $projRows = $pdo->query(
      "SELECT p.id, p.title, p.year, p.category, p.description, p.featured, p.importance, p.album_id, p.featured_project_id
       FROM projects p
       ORDER BY COALESCE(p.importance,0) DESC, p.year DESC"
    )->fetchAll();

    // Récupération des images pour chaque projet
    $coverRows = $pdo->query(
      "SELECT project_id, url, `order` FROM covers ORDER BY project_id, `order`"
    )->fetchAll();

    // Construction d'une map projet_id => images
    $coversMap = [];
    foreach ($coverRows as $r) {
      $projId = (int)$r['project_id'];
      if (!isset($coversMap[$projId])) {
        $coversMap[$projId] = [];
      }
      $coversMap[$projId][] = $r['url'];
    }

    // Récupération des liens associés à chaque projet
    $linkRows = $pdo->query(
      "SELECT project_id, GROUP_CONCAT(CONCAT(label,'|',url) SEPARATOR '||') AS link_list
       FROM links GROUP BY project_id"
    )->fetchAll();

    // Construction d'une map projet_id => liens
    $linksMap = [];
    foreach ($linkRows as $r) {
      $pairs = $r['link_list'] ? explode('||', $r['link_list']) : [];
      $arr = [];
      foreach ($pairs as $pair) {
        $tmp = explode('|', $pair, 2);
        if (count($tmp) === 2) $arr[] = ['label' => $tmp[0], 'url' => $tmp[1]];
      }
      $linksMap[(int)$r['project_id']] = $arr;
    }

    // Formatage final des projets
    foreach ($projRows as $r) {
      $projects[] = [
        'id'         => (int)$r['id'],
        'title'      => $r['title'],
        'year'       => (int)$r['year'],
        'category'   => $r['category'],
        'description' => $r['description'],
        'links'      => $linksMap[(int)$r['id']] ?? [],
        'covers'     => $coversMap[(int)$r['id']] ?? [],
        'cover'      => $coversMap[(int)$r['id']][0] ?? null, // Pour compatibilité, première image
        'featured'   => (bool)$r['featured'],
        'importance' => (int)($r['importance'] ?? 0),
        'album_id'   => $r['album_id'] ? (int)$r['album_id'] : null,
        'featured_project_id' => (int)$r['featured_project_id'],
      ];
    }
  } catch (Throwable $e) {
    // Fallback local : données mock si la base est indisponible
    $projects = [
      ['id' => 1, 'title' => 'Portfolio Initial', 'year' => 2023, 'category' => 'Web', 'description' => "Mon premier portfolio personnel avec scrollytelling", 'links' => [['label' => 'Live', 'url' => 'https://example.com']], 'cover' => null, 'featured' => true, 'importance' => 85, 'album_id' => 1, 'featured_project_id' => 1],
      ['id' => 2, 'title' => 'Startup Landing', 'year' => 2023, 'category' => 'Web', 'description' => "Landing page moderne pour startup fictive", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 80, 'album_id' => 1, 'featured_project_id' => 1],
      ['id' => 3, 'title' => 'Design System', 'year' => 2023, 'category' => 'Design', 'description' => "Système de design réutilisable", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 78, 'album_id' => 2, 'featured_project_id' => 1],
      ['id' => 4, 'title' => 'Responsive Website', 'year' => 2023, 'category' => 'Web', 'description' => "Site responsive avec CSS moderne", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 72, 'album_id' => 3, 'featured_project_id' => 2],
      ['id' => 5, 'title' => 'Todo App', 'year' => 2023, 'category' => 'Web', 'description' => "Application Todo avec localStorage", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 76, 'album_id' => 4, 'featured_project_id' => 2],
      ['id' => 6, 'title' => 'Plateforme Éducative', 'year' => 2024, 'category' => 'Produit', 'description' => "Plateforme e-learning au Canada", 'links' => [], 'cover' => null, 'featured' => true, 'importance' => 88, 'album_id' => 5, 'featured_project_id' => 3],
      ['id' => 7, 'title' => 'Dashboard Analytics', 'year' => 2024, 'category' => 'Data', 'description' => "Dashboard d'analyse de données", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 82, 'album_id' => 5, 'featured_project_id' => 3],
      ['id' => 8, 'title' => 'Generateur Couleurs', 'year' => 2024, 'category' => 'Outil', 'description' => "Générateur de palettes de couleurs", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 70, 'album_id' => 7, 'featured_project_id' => 4],
      ['id' => 9, 'title' => 'Snake Game', 'year' => 2024, 'category' => 'Jeu', 'description' => "Implémentation du jeu Snake", 'links' => [], 'cover' => null, 'featured' => false, 'importance' => 65, 'album_id' => 8, 'featured_project_id' => 4],
    ];
  }

  // Tri des projets par importance puis année (descendant)
  usort($projects, function ($a, $b) {
    $i = ($b['importance'] ?? 0) <=> ($a['importance'] ?? 0);
    return $i !== 0 ? $i : (($b['year'] ?? 0) <=> ($a['year'] ?? 0));
  });

  return $projects;
}

/**
------------------------------------------------------------
 extractMetadata($projects)
------------------------------------------------------------
 Extrait les métadonnées globales des projets :
 - Catégories uniques (triées)
 - Années uniques (triées desc)
 Retourne : array compacté 'categories', 'years'
 */
function extractMetadata($projects)
{
  // Catégories uniques
  $categories = array_values(array_unique(array_map(fn($p) => $p['category'], $projects)));
  sort($categories);

  // Années uniques
  $years = array_values(array_unique(array_map(fn($p) => $p['year'], $projects)));
  rsort($years);

  return compact('categories', 'years');
}

/**
------------------------------------------------------------
 getTopCategories($projects, $limit = 5)
------------------------------------------------------------
 Retourne les catégories les plus populaires basées sur 
 la moyenne de l'importance des projets.
 Pour chaque catégorie, retourne :
 - Le nom de la catégorie
 - La moyenne de l'importance
 - Les meilleurs projets de cette catégorie (6 max)
 Paramètres :
 - $projects : tableau des projets
 - $limit : nombre de catégories à retourner (défaut: 5)
 Retourne : array de catégories avec leurs projets
 */
function getTopCategories($projects, $limit = 5)
{
  // Grouper les projets par catégorie
  $categoriesData = [];
  
  foreach ($projects as $project) {
    $category = $project['category'];
    
    if (!isset($categoriesData[$category])) {
      $categoriesData[$category] = [
        'name' => $category,
        'projects' => [],
        'totalImportance' => 0,
        'count' => 0
      ];
    }
    
    $categoriesData[$category]['projects'][] = $project;
    $categoriesData[$category]['totalImportance'] += $project['importance'];
    $categoriesData[$category]['count']++;
  }
  
  // Calculer la moyenne d'importance pour chaque catégorie
  foreach ($categoriesData as $category => &$data) {
    $data['averageImportance'] = $data['totalImportance'] / $data['count'];
    
    // Trier les projets de cette catégorie par importance (décroissant)
    usort($data['projects'], function($a, $b) {
      return ($b['importance'] ?? 0) <=> ($a['importance'] ?? 0);
    });
    
    // Garder seulement les 6 meilleurs projets
    $data['projects'] = array_slice($data['projects'], 0, 6);
  }
  
  // Trier les catégories par moyenne d'importance (décroissant)
  usort($categoriesData, function($a, $b) {
    return $b['averageImportance'] <=> $a['averageImportance'];
  });
  
  // Retourner seulement le nombre demandé de catégories
  return array_slice($categoriesData, 0, $limit);
}

/**
------------------------------------------------------------
 getFeaturedProjects()
------------------------------------------------------------
 Récupère les 4 grands projets principaux (featured_projects).
 Retourne : tableau des projets importants
 */
function getFeaturedProjects()
{
  $featured = [];

  try {
    $pdo = new PDO(DB_DSN, DB_USER_FINAL, DB_PASS_FINAL, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $rows = $pdo->query(
      "SELECT id, name, description, gif_url, `order`
       FROM featured_projects
       ORDER BY `order` ASC"
    )->fetchAll();

    foreach ($rows as $r) {
      $featured[] = [
        'id'          => (int)$r['id'],
        'name'        => $r['name'],
        'description' => $r['description'],
        'gif_url'     => $r['gif_url'],
        'order'       => (int)$r['order'],
      ];
    }
  } catch (Throwable $e) {
    // Fallback vide si DB indisponible
    $featured = [];
  }

  return $featured;
}

/**
------------------------------------------------------------
 getAlbums($featured_project_id = null)
------------------------------------------------------------
 Récupère les albums (thèmes) pour un projet principal donné,
 ou tous les albums si featured_project_id est null.
 Retourne : tableau des albums
 */
function getAlbums($featured_project_id = null)
{
  $albums = [];

  try {
    $pdo = new PDO(DB_DSN, DB_USER_FINAL, DB_PASS_FINAL, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $query = "SELECT id, featured_project_id, name, description, `order`
              FROM albums";
    
    if ($featured_project_id !== null) {
      $query .= " WHERE featured_project_id = " . (int)$featured_project_id;
    }
    
    $query .= " ORDER BY `order` ASC";

    $rows = $pdo->query($query)->fetchAll();

    foreach ($rows as $r) {
      $albums[] = [
        'id'                  => (int)$r['id'],
        'featured_project_id' => (int)$r['featured_project_id'],
        'name'                => $r['name'],
        'description'         => $r['description'],
        'order'               => (int)$r['order'],
      ];
    }
  } catch (Throwable $e) {
    // Fallback vide si DB indisponible
    $albums = [];
  }

  return $albums;
}

/**
------------------------------------------------------------
 getProjectsByAlbum($album_id)
------------------------------------------------------------
 Récupère tous les projets d'un album donné.
 Retourne : tableau des projets de l'album
 */
function getProjectsByAlbum($album_id)
{
  $projects = [];

  try {
    $pdo = new PDO(DB_DSN, DB_USER_FINAL, DB_PASS_FINAL, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    $stmt = $pdo->prepare(
      "SELECT id, album_id, title, description, image_url, link, year, category, importance
       FROM projects
       WHERE album_id = :album_id
       ORDER BY importance DESC, year DESC"
    );
    $stmt->execute([':album_id' => (int)$album_id]);
    $rows = $stmt->fetchAll();

    foreach ($rows as $r) {
      $categories = !empty($r['category']) ? explode(',', $r['category']) : [];
      $categories = array_map('trim', $categories);

      $projects[] = [
        'id'          => (int)$r['id'],
        'album_id'    => (int)$r['album_id'],
        'title'       => $r['title'],
        'description' => $r['description'],
        'image'       => $r['image_url'],
        'link'        => $r['link'],
        'year'        => !empty($r['year']) ? (int)$r['year'] : null,
        'categories'  => $categories,
      ];
    }
  } catch (Throwable $e) {
    // Fallback vide si DB indisponible
    $projects = [];
  }

  return $projects;
}
