<?php

// Connexion à la base de données et récupération des projets
require_once 'db.php';

$projects = getProjects();
extract(extractMetadata($projects));
$topCategories = getTopCategories($projects, 5);
$featuredProjects = getFeaturedProjects();
$albums = getAlbums();

/* ============================================
   FONCTIONS UTILITAIRES PHP
   ============================================ */

// Génère un slug URL-friendly à partir d'un texte
function slugify($text)
{
  $text = strtolower(trim($text));
  $text = preg_replace('~[^a-z0-9]+~', '-', $text);
  return trim($text, '-');
}

// Génère un gradient CSS basé sur le hash d'une chaîne
function gradientFromString($str)
{
  $hash = 0;
  for ($i = 0; $i < strlen($str); $i++) {
    $hash = ord($str[$i]) + (($hash << 5) - $hash);
  }
  $h1 = ($hash % 360 + 360) % 360;
  $h2 = (($hash >> 3) % 360 + 360) % 360;
  return "linear-gradient(135deg, hsl($h1,80%,55%) 0%, hsl($h2,80%,55%) 100%)";
}

/* ============================================
   CONFIGURATION DE LA NAVIGATION
   ============================================ */

// Menu principal de la sidebar
$mainNavItems = [
  ['view' => 'home', 'label' => 'Accueil', 'icon' => '<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2h-4V12H9v10H5a2 2 0 0 1-2-2z" fill="currentColor" />'],
  ['view' => 'library', 'label' => 'Tous mes projets', 'icon' => '<path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" fill="currentColor" />'],
  ['view' => 'playlists', 'label' => 'Par catégorie', 'icon' => '<path d="M4 6h12v2H4zM4 10h12v2H4zM4 14h12v2H4zM18 6h2v10h-2z" fill="currentColor" />'],
  ['view' => 'about', 'label' => 'Contact', 'icon' => '<path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5z" fill="currentColor" />'],
];
?>

<!doctype html>
<html lang="fr" data-theme="dark">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Portfolio Morgan Duchamp</title>
  <meta name="description" content="Portfolio inspiré d'Apple Musique : Accueil, Bibliothèque, Playlists.">
  <link rel="stylesheet" href="style.css">
  <script src="script.js" defer></script>
  <link rel="apple-touch-icon-precomposed" sizes="57x57" href="img/favicon/apple-touch-icon-57x57.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="img/favicon/apple-touch-icon-114x114.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="img/favicon/apple-touch-icon-72x72.png" />
  <link rel="apple-touch-icon-precomposed" sizes="144x144" href="img/favicon/apple-touch-icon-144x144.png" />
  <link rel="apple-touch-icon-precomposed" sizes="60x60" href="img/favicon/apple-touch-icon-60x60.png" />
  <link rel="apple-touch-icon-precomposed" sizes="120x120" href="img/favicon/apple-touch-icon-120x120.png" />
  <link rel="apple-touch-icon-precomposed" sizes="76x76" href="img/favicon/apple-touch-icon-76x76.png" />
  <link rel="apple-touch-icon-precomposed" sizes="152x152" href="img/favicon/apple-touch-icon-152x152.png" />
  <link rel="icon" type="image/png" href="img/favicon/favicon-196x196.png" sizes="196x196" />
  <link rel="icon" type="image/png" href="img/favicon/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/png" href="img/favicon/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="img/favicon/favicon-16x16.png" sizes="16x16" />
  <link rel="icon" type="image/png" href="img/favicon/favicon-128.png" sizes="128x128" />
  <meta name="application-name" content="&nbsp;"/>
  <meta name="msapplication-TileColor" content="#FFFFFF" />
  <meta name="msapplication-TileImage" content="img/favicon/mstile-144x144.png" />
  <meta name="msapplication-square70x70logo" content="img/favicon/mstile-70x70.png" />
  <meta name="msapplication-square150x150logo" content="img/favicon/mstile-150x150.png" />
  <meta name="msapplication-wide310x150logo" content="img/favicon/mstile-310x150.png" />
  <meta name="msapplication-square310x310logo" content="img/favicon/mstile-310x310.png" />
</head>

<body>
  <div class="layout">

    <!-- ============================================
         SIDEBAR - Navigation principale (desktop)
         ============================================ -->
    <aside>
      <!-- Branding -->
      <div class="brand">
        <div class="logo" style="--logo-img: url('img/moi.jpeg');"></div>
        <div class="brand-text">
          <h1>Morgan Duchamp</h1>
          <p>Développeur Digital</p>
        </div>
      </div>

      <!-- Bouton toggle sidebar -->
      <button id="sidebarToggle" aria-label="Replier/ouvrir la barre latérale" aria-expanded="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
          <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
        </svg>
        <span>Menu</span>
      </button>

      <!-- Bouton toggle thème -->
      <button id="themeToggle" class="onair" aria-pressed="false" title="Basculer le thème (clair/sombre)">
        <span class="dot" aria-hidden="true"></span><span id="onair-label">Mode : Sombre</span>
      </button>

      <!-- Barre de recherche -->
      <div class="s-search" role="search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="16" height="16">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input id="sidebar-q" type="search" placeholder="Rechercher…" aria-label="Rechercher" autocomplete="off" />
      </div>

      <!-- Navigation principale -->
      <nav>
        <div>
          <div class="section-label">Menu</div>
          <div class="nav-items" id="primary">
            <?php foreach ($mainNavItems as $idx => $navItem): ?>
              <a class="item <?= $idx === 0 ? 'active' : '' ?>" data-view="<?= htmlspecialchars($navItem['view']) ?>">
                <svg viewBox="0 0 24 24"><?= $navItem['icon'] ?></svg>
                <span><?= htmlspecialchars($navItem['label']) ?></span>
              </a>
            <?php endforeach; ?>
          </div>
        </div>

        <!-- Playlists rapides -->
        <div>
          <div class="section-label">Accès rapide</div>
          <div class="nav-items" id="quick-playlists">

            <!-- Années récentes -->
            <?php
            $quickYears = array_slice($years, 0, 6);
            foreach ($quickYears as $y):
            ?>
              <a class="item sub" data-quick="year" data-value="<?= $y ?>">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="8" fill="currentColor" />
                </svg>
                <span><?= $y ?></span>
              </a>
            <?php endforeach; ?>

            <!-- Catégories -->
            <?php foreach ($categories as $cat): ?>
              <a class="item sub" data-quick="category" data-value="<?= htmlspecialchars($cat) ?>">
                <svg viewBox="0 0 24 24">
                  <rect x="5" y="5" width="14" height="14" rx="3" fill="currentColor" />
                </svg>
                <span><?= htmlspecialchars($cat) ?></span>
              </a>
            <?php endforeach; ?>
          </div>
        </div>
      </nav>
    </aside>

    <!-- ============================================
         CONTENU PRINCIPAL
         ============================================ -->
    <main id="app" tabindex="-1">
      <!-- Header avec titre et recherche top-right -->
      <div class="header-top">
        <h2 id="view-title">Accueil</h2>

        <!-- Barre de recherche top-right (visible uniquement en sidebar repliée) -->
        <div class="top-search" id="top-search" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" width="16" height="16">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input id="top-search-input" type="search" placeholder="Rechercher…" autocomplete="off" />
        </div>

        <div class="hint" id="view-sub"></div>
      </div>

      <!-- Zone de contenu dynamique (géré par JavaScript) -->
      <div id="view"></div>
    </main>
  </div>

  <!-- ============================================
       MODAL - Détails du projet
       ============================================ -->
  <dialog id="modal" aria-labelledby="modal-title">
    <div class="modal">
      <!-- Couverture du projet avec galerie -->
      <div class="cover-xl-container">
        <div class="cover-xl" id="modal-cover"></div>
        
        <!-- Flèches de navigation pour la galerie -->
        <button class="gallery-nav gallery-prev" id="gallery-prev" aria-label="Image précédente" style="display: none;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
          </svg>
        </button>
        <button class="gallery-nav gallery-next" id="gallery-next" aria-label="Image suivante" style="display: none;">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
          </svg>
        </button>
        
        <!-- Compteur d'images -->
        <div class="gallery-counter" id="gallery-counter" style="display: none;">
          <span id="gallery-current">1</span> / <span id="gallery-total">1</span>
        </div>
      </div>

      <!-- Informations du projet -->
      <div>
        <!-- Bouton fermer -->
        <button class="close" id="close" aria-label="Fermer">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div class="year" id="modal-year"></div>
        <h3 id="modal-title" style="margin-top:4px;">Titre</h3>
        <p class="desc" id="modal-desc"></p>
        <div id="modal-links"></div>
      </div>
    </div>
  </dialog>

  <!-- Lightbox pour affichage fullscreen de l'image -->
  <div id="lightbox" class="lightbox" style="display: none;">
    <div class="lightbox-content">
      <!-- Bouton fermer -->
      <button class="lightbox-close" id="lightbox-close" aria-label="Fermer">
        <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      <!-- Image -->
      <img id="lightbox-image" src="" alt="Image fullscreen" />

      <!-- Flèches de navigation (plus grandes) -->
      <button class="lightbox-nav lightbox-prev" id="lightbox-prev" aria-label="Image précédente">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"/>
        </svg>
      </button>
      <button class="lightbox-nav lightbox-next" id="lightbox-next" aria-label="Image suivante">
        <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6-6-6z"/>
        </svg>
      </button>

      <!-- Compteur d'images (plus grand) -->
      <div class="lightbox-counter" id="lightbox-counter">
        <span id="lightbox-current">1</span> / <span id="lightbox-total">1</span>
      </div>
    </div>
  </div>

  <!-- ============================================
       LECTEUR - Barre de lecture en bas
       ============================================ -->
  <div class="now" aria-hidden="false">
    <div class="now-inner">
      <!-- Miniature et informations -->
      <div class="mini">
        <div class="art" id="mini-art"></div>
        <div>
          <div class="t" id="mini-title">Sélectionnez un projet</div>
          <div class="s" id="mini-sub">—</div>
        </div>
      </div>

      <!-- Contrôles de lecture -->
      <div class="controls">
        <button class="ctrl" id="btn-prev" aria-label="Reculer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 6h2v12H6zM20 6v12L8 12 20 6z" />
          </svg>
        </button>

        <button class="ctrl" id="btn-play" aria-label="Lecture/Pause">
          <svg id="icon-play" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7-11-7z" />
          </svg>
          <svg id="icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none">
            <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
          </svg>
        </button>

        <button class="ctrl" id="btn-next" aria-label="Avancer">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M5 6v12l9-6-9-6zM17 6v12h2V6h-2z" />
          </svg>
        </button>
      </div>

      <!-- Barre de progression -->
      <div class="progress">
        <div class="bar" id="mini-bar"></div>
      </div>
    </div>
  </div>

  <!-- ============================================
       NAVIGATION MOBILE - Bottom bar
       ============================================ -->
  <nav class="mobile-nav" aria-label="Navigation mobile">
    <!-- Boutons de navigation -->
    <div class="mobile-actions">
      <button class="mnav-btn" data-view="home" aria-label="Accueil" title="Accueil">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M3 10l9-7 9 7v9a2 2 0 0 1-2 2h-4v-7H9v7H5a2 2 0 0 1-2-2z" />
        </svg>
      </button>

      <button class="mnav-btn" data-view="library" aria-label="Bibliothèque" title="Bibliothèque">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h10v2H4z" />
        </svg>
      </button>

      <button class="mnav-btn" data-view="playlists" aria-label="Playlists" title="Playlists">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M4 6h12v2H4zM4 10h12v2H4zM4 14h12v2H4zM18 6h2v10h-2z" />
        </svg>
      </button>

      <button class="mnav-btn" data-view="about" aria-label="À propos" title="À propos">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
          <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5z" />
        </svg>
      </button>

      <button class="mnav-btn" id="mnav-search-toggle" aria-label="Rechercher" title="Rechercher">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>

    <!-- Champ de recherche mobile (glisse depuis la droite) -->
    <div class="mobile-search" aria-hidden="true">
      <input id="mobile-search-input" type="search" placeholder="Rechercher…" autocomplete="off" />
      <button class="mnav-close" id="mnav-search-close" aria-label="Fermer la recherche">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  </nav>

  <!-- ============================================
       BOUTON THÈME FLOTTANT (MOBILE)
       ============================================ -->
  <button id="themeToggleMobile" class="onair onair-float" aria-pressed="false" title="Basculer le thème (clair/sombre)">
    <span class="dot" aria-hidden="true"></span>
    <span id="onair-label-mobile">Mode : Sombre</span>
  </button>

  <!-- ============================================
       DONNÉES PHP POUR JAVASCRIPT
       ============================================ -->
  <script>
    // Injection des données PHP en JavaScript
    const projects = <?php echo json_encode($projects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    const years = <?php echo json_encode($years, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    const categories = <?php echo json_encode($categories, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    const topCategories = <?php echo json_encode($topCategories, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    const featuredProjects = <?php echo json_encode($featuredProjects, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
    const albums = <?php echo json_encode($albums, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES); ?>;
  </script>
  
</body>

</html>