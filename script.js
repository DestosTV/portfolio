/* ============================================
   PORTFOLIO - SCRIPT PRINCIPAL
   Gestion de la navigation, recherche, thème, et lecteur
   ============================================ */

/* ============================================
   UTILITAIRES GÉNÉRAUX
   ============================================ */

// Génère un slug URL-friendly à partir d'une chaîne
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

window.slug = slug;

// Génère un gradient basé sur le hash d'une chaîne
function grad(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = s.charCodeAt(i) + ((h << 5) - h);
  const a = ((h % 360) + 360) % 360,
    b = (((h >> 3) % 360) + 360) % 360;
  return `linear-gradient(135deg,hsl(${a},80%,55%) 0%,hsl(${b},80%,55%) 100%)`;
}

/* ============================================
   GESTION DU THÈME (CLAIR/SOMBRE)
   Unifié pour desktop et mobile
   ============================================ */
(function initThemeUnified() {
  const root = document.documentElement;
  const btnDesktop = document.getElementById("themeToggle");
  const btnMobile = document.getElementById("themeToggleMobile");
  const labDesktop = document.getElementById("onair-label");
  const labMobile = document.getElementById("onair-label-mobile");

  // Initialisation depuis localStorage ou préférence système
  const saved = localStorage.getItem("theme");
  if (saved === "light" || saved === "dark") {
    root.setAttribute("data-theme", saved);
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    root.setAttribute("data-theme", "light");
  } else {
    root.setAttribute("data-theme", "dark");
  }

  // Met à jour les labels des boutons
  function updateLabels() {
    const light = root.getAttribute("data-theme") === "light";
    if (labDesktop)
      labDesktop.textContent = light ? "Mode : Clair" : "Mode : Sombre";
    if (labMobile)
      labMobile.textContent = light ? "Mode : Clair" : "Mode : Sombre";
    if (btnDesktop)
      btnDesktop.setAttribute("aria-pressed", light ? "true" : "false");
    if (btnMobile)
      btnMobile.setAttribute("aria-pressed", light ? "true" : "false");
  }

  // Change le thème
  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateLabels();
  }

  // Alterne entre clair et sombre
  function toggleTheme() {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    setTheme(next);
  }

  // Connexion des boutons desktop et mobile
  if (btnDesktop) btnDesktop.onclick = toggleTheme;
  if (btnMobile) btnMobile.onclick = toggleTheme;

  // Exposition globale pour usage externe
  window.__setTheme = setTheme;
  window.__toggleTheme = toggleTheme;

  updateLabels();
})();

/* ============================================
   GESTION DE LA SIDEBAR (REPLIÉE/DÉPLIÉE)
   ============================================ */
const bodyEl = document.body;
const ASIDE_KEY = "asideCollapsed";

// Applique l'état de la sidebar selon localStorage ou breakpoint mobile
function applyAsideState() {
  const collapsed =
    localStorage.getItem(ASIDE_KEY) === "1" ||
    (window.matchMedia("(max-width: 900px)").matches &&
      localStorage.getItem(ASIDE_KEY) !== "0");
  bodyEl.classList.toggle("aside-collapsed", collapsed);
  const tgl = document.getElementById("sidebarToggle");
  if (tgl) tgl.setAttribute("aria-expanded", collapsed ? "false" : "true");
}

applyAsideState();

window.addEventListener("resize", () => {
  applyAsideState();
});

// Toggle manuel de la sidebar
const sidebarToggle = document.getElementById("sidebarToggle");
if (sidebarToggle) {
  sidebarToggle.addEventListener("click", () => {
    const collapsed = !bodyEl.classList.contains("aside-collapsed");
    bodyEl.classList.toggle("aside-collapsed", collapsed);
    localStorage.setItem(ASIDE_KEY, collapsed ? "1" : "0");
    sidebarToggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
  });
}

/* ============================================
   CRÉATION DES CARTES DE PROJET
   ============================================ */
function card(p) {
  const cover = p.cover ? `url('${p.cover}')` : grad(p.title);
  const el = document.createElement("article");
  el.className = "card";
  el.tabIndex = 0;
  el.dataset.slug = slug(p.title);
  el.innerHTML = `
    <div class="thumb"><div class="art" style="background-image:${cover}"></div>
      <button class="play" aria-label="Voir les détails" data-open="${slug(
        p.title
      )}">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7-11-7z"/></svg>
      </button>
    </div>
    <div class="meta"><div class="title">${
      p.title
    }</div><div class="subtitle">${p.category} • ${p.year}</div></div>`;

  // Ouvre le projet au clic
  el.addEventListener("click", (e) => {
    if (e.target.closest("[data-open]") || e.currentTarget === el)
      openProject(p);
  });

  // Ouvre le projet avec Enter (accessibilité)
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") openProject(p);
  });

  return el;
}

/* ============================================
   ÉLÉMENT DE LISTE (Style Apple Music)
   ============================================ */
function playlistItem(p, index) {
  const el = document.createElement("div");
  el.className = "playlist-item";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.padding = "12px 16px";
  el.style.borderRadius = "8px";
  el.style.cursor = "pointer";
  el.style.transition = "background-color 0.2s";
  el.style.backgroundColor = "var(--bg-secondary)";
  el.style.marginBottom = "8px";
  el.style.gap = "12px";

  // Numéro à gauche
  const number = document.createElement("div");
  number.style.minWidth = "35px";
  number.style.fontSize = "0.95rem";
  number.style.fontWeight = "600";
  number.style.color = "var(--muted)";
  number.style.textAlign = "center";
  number.textContent = String(index + 1).padStart(2, "0");

  // Image du projet (ou dégradé si pas d'image) - création, pas d'ajout à el pour l'instant
  let imageEl = null;
  if (p.cover) {
    const img = document.createElement("img");
    img.src = p.cover;
    img.setAttribute("alt", p.title);
    img.style.width = "48px";
    img.style.height = "48px";
    img.style.minWidth = "48px";
    img.style.minHeight = "48px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "6px";
    imageEl = img;
  } else {
    const imgPlaceholder = document.createElement("div");
    imgPlaceholder.style.width = "48px";
    imgPlaceholder.style.height = "48px";
    imgPlaceholder.style.minWidth = "48px";
    imgPlaceholder.style.minHeight = "48px";
    imgPlaceholder.style.borderRadius = "6px";
    imgPlaceholder.style.background = grad(p.title);
    imageEl = imgPlaceholder;
  }

  // Infos du projet (tout horizontal)
  const info = document.createElement("div");
  info.className = "playlist-info";
  info.style.flex = "1";
  info.style.minWidth = "0";
  info.style.display = "flex";
  info.style.justifyContent = "space-between";
  info.style.alignItems = "center";
  info.style.gap = "16px";

  const leftPart = document.createElement("div");
  leftPart.className = "playlist-left";
  leftPart.style.flex = "1";
  leftPart.style.minWidth = "0";
  leftPart.style.display = "flex";
  leftPart.style.alignItems = "center";
  leftPart.style.gap = "12px";

  const textInfo = document.createElement("div");
  textInfo.style.flex = "1";
  textInfo.style.minWidth = "0";
  textInfo.style.display = "flex";
  textInfo.style.flexDirection = "column";
  textInfo.style.alignItems = "flex-start";

  const title = document.createElement("div");
  title.style.fontWeight = "600";
  title.style.fontSize = "0.95rem";
  title.style.whiteSpace = "nowrap";
  title.style.overflow = "ellipsis";
  title.style.overflow = "hidden";
  title.textContent = p.title;
  textInfo.appendChild(title);

  // Ajouter meta aussi dans textInfo pour mobile
  const metaMobile = document.createElement("div");
  metaMobile.className = "playlist-meta-mobile";
  metaMobile.style.fontSize = "0.85rem";
  metaMobile.style.color = "var(--muted)";
  metaMobile.style.whiteSpace = "nowrap";
  metaMobile.style.marginTop = "4px";
  metaMobile.style.display = "none";
  metaMobile.textContent = `${p.category} • ${p.year}`;
  textInfo.appendChild(metaMobile);

  leftPart.appendChild(number);
  leftPart.appendChild(imageEl);
  leftPart.appendChild(textInfo);
  info.appendChild(leftPart);

  const rightPart = document.createElement("div");
  rightPart.className = "playlist-right";
  rightPart.style.flex = "1";
  rightPart.style.display = "flex";
  rightPart.style.justifyContent = "flex-start";
  rightPart.style.alignItems = "center";

  const meta = document.createElement("div");
  meta.style.fontSize = "0.85rem";
  meta.style.color = "var(--muted)";
  meta.style.whiteSpace = "nowrap";
  meta.textContent = `${p.category} • ${p.year}`;
  rightPart.appendChild(meta);

  info.appendChild(rightPart);
  el.appendChild(info);

  // Hover effect
  el.addEventListener("mouseenter", () => {
    el.style.backgroundColor = "var(--bg)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.backgroundColor = "var(--bg-secondary)";
  });

  // Ouvrir le projet au clic
  el.addEventListener("click", () => {
    currentProjectIndex = index;
    openProject(p);
  });

  return el;
}

/* ============================================
   AFFICHAGE D'UNE PLAYLIST (Liste verticale)
   ============================================ */
function renderPlaylist(featuredProjectId, name, subtitle) {
  const playlistProjects = projects.filter(
    (p) => p.featured_project_id === featuredProjectId
  );

  // Tracker la playlist courante
  currentPlaylistId = featuredProjectId;

  fadeTransition(() => {
    setViewTitle(name, subtitle);
    view.innerHTML = "";

    // Bouton "Retour à l'accueil"
    const backBtn = document.createElement("button");
    backBtn.className = "back-btn";
    backBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
        <path d="M19 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H19v-2z"/>
      </svg>
      Retour
    `;
    backBtn.addEventListener("click", () => {
      fadeTransition(() => {
        document.querySelectorAll(".item").forEach((i) =>
          i.classList.remove("active")
        );
        const homeItem = document.querySelector('[data-view="home"]');
        if (homeItem) homeItem.classList.add("active");
        renderHome();
      });
    });
    view.appendChild(backBtn);

    // Header pour la liste (même structure que playlistItem)
    const header = document.createElement("div");
    header.className = "playlist-header";
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.padding = "12px 16px";
    header.style.marginTop = "20px";
    header.style.marginBottom = "8px";
    header.style.borderBottom = "1px solid var(--border)";
    header.style.gap = "12px";

    // Info container
    const headerInfo = document.createElement("div");
    headerInfo.style.flex = "1";
    headerInfo.style.minWidth = "0";
    headerInfo.style.display = "flex";
    headerInfo.style.justifyContent = "space-between";
    headerInfo.style.alignItems = "center";
    headerInfo.style.gap = "16px";

    // Left part (numéro + image + titre)
    const headerLeftPart = document.createElement("div");
    headerLeftPart.style.flex = "1";
    headerLeftPart.style.minWidth = "0";
    headerLeftPart.style.display = "flex";
    headerLeftPart.style.alignItems = "center";
    headerLeftPart.style.gap = "12px";

    const headerNumber = document.createElement("div");
    headerNumber.style.minWidth = "35px";
    headerLeftPart.appendChild(headerNumber);

    const headerImage = document.createElement("div");
    headerImage.style.width = "48px";
    headerImage.style.minWidth = "48px";
    headerLeftPart.appendChild(headerImage);

    const headerTitle = document.createElement("div");
    headerTitle.style.flex = "1";
    headerTitle.style.minWidth = "0";
    headerTitle.style.fontSize = "0.85rem";
    headerTitle.style.fontWeight = "600";
    headerTitle.style.color = "var(--muted)";
    headerTitle.textContent = "Titre";
    headerLeftPart.appendChild(headerTitle);

    headerInfo.appendChild(headerLeftPart);

    // Right part (catégorie • année)
    const headerRightPart = document.createElement("div");
    headerRightPart.style.flex = "1";
    headerRightPart.style.display = "flex";
    headerRightPart.style.justifyContent = "flex-start";
    headerRightPart.style.alignItems = "center";

    const headerMeta = document.createElement("div");
    headerMeta.style.fontSize = "0.85rem";
    headerMeta.style.fontWeight = "600";
    headerMeta.style.color = "var(--muted)";
    headerMeta.textContent = "Catégorie • Année";
    headerRightPart.appendChild(headerMeta);

    headerInfo.appendChild(headerRightPart);
    header.appendChild(headerInfo);
    view.appendChild(header);

    // Container pour la liste
    const listContainer = document.createElement("div");
    listContainer.style.marginTop = "0px";
    view.appendChild(listContainer);

    // Afficher les projets en liste verticale
    playlistProjects.forEach((p, index) => {
      listContainer.appendChild(playlistItem(p, index));
    });
  });
}

/* ============================================
   PAGE D'ACCUEIL
   ============================================ */
const view = document.getElementById("view");
const viewTitle = document.getElementById("view-title");
const viewSub = document.getElementById("view-sub");

function setViewTitle(t, sub = "") {
  viewTitle.textContent = t;
  viewSub.textContent = sub;
}

/* ============================================
   RENDU DES DIFFÉRENTES PAGES
   ============================================ */

// Page d'accueil avec projets en vedette et récents
function renderHome() {
  setViewTitle("Accueil", "Développement web & création numérique");
  view.innerHTML = "";

  // Section Hero - Présentation
  const hero = document.createElement("section");
  hero.className = "hero";
  hero.innerHTML = `
    <div class="hero-inner">
      <h1 class="hero-title">Morgan Duchamp</h1>
      <p class="hero-subtitle">Étudiant en 2ème année de BUT MMI à l'IUT de Sénart/Fontainebleau</p>
      <p class="hero-desc">Passionné par le développement web et la création numérique, je conçois des projets alliant design et code.</p>
      <p class="hero-desc">Je recherche une alternance dans le domaine du graphisme, de la photographie ou du web du 1<sup>er</sup> septembre 2026 au 31 août 2027.</p>
      <div class="hero-actions">
        <a href="files/CV_MorganDuchamp.pdf" class="hero-btn primary" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm8 2H4v2h16v-2z"/>
          </svg>
          Mon CV
        </a>
        <button class="hero-btn secondary" data-view="about">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          Me contacter
        </button>
      </div>
    </div>
  `;
  view.appendChild(hero);

  // Bouton contact dans le hero
  const contactBtn = hero.querySelector('[data-view="about"]');
  if (contactBtn) {
    contactBtn.addEventListener('click', () => {
      fadeTransition(() => {
        document.querySelectorAll('.item').forEach(i => i.classList.remove('active'));
        const aboutItem = document.querySelector('[data-view="about"]');
        if (aboutItem) aboutItem.classList.add('active');
        renderAbout();
      });
    });
  }

  // Section "Playlists personnalisées"
  const h2 = document.createElement("h3");
  h2.textContent = "À explorer";
  view.appendChild(h2);

  const playlistsGrid = document.createElement("div");
  playlistsGrid.className = "playlists-grid";
  playlistsGrid.style.display = "grid";
  playlistsGrid.style.gridTemplateColumns = "repeat(auto-fit, minmax(300px, 1fr))";
  playlistsGrid.style.gap = "32px";
  playlistsGrid.style.marginTop = "20px";
  playlistsGrid.style.marginBottom = "40px";
  view.appendChild(playlistsGrid);

  featuredProjects.forEach((fp) => {
    const playlistCard = document.createElement("div");
    playlistCard.className = "playlist-card";
    playlistCard.style.cursor = "pointer";
    playlistCard.style.borderRadius = "12px";
    playlistCard.style.overflow = "hidden";
    playlistCard.style.position = "relative";
    playlistCard.style.background = "var(--bg-secondary)";
    playlistCard.style.transition = "transform 0.3s, box-shadow 0.3s";
    playlistCard.style.maxWidth = "400px";
    playlistCard.style.maxHeight = "500px";
    playlistCard.style.margin = "0 auto";

    // GIF de fond (carré)
    const gifImg = document.createElement("img");
    gifImg.src = fp.gif_url;
    gifImg.setAttribute("alt", fp.name);
    gifImg.style.width = "100%";
    gifImg.style.aspectRatio = "1";
    gifImg.style.objectFit = "cover";
    gifImg.style.display = "block";
    playlistCard.appendChild(gifImg);

    // Overlay avec infos
    const overlay = document.createElement("div");
    overlay.style.padding = "16px";
    overlay.style.background = "var(--bg-primary)";

    const nameEl = document.createElement("h4");
    nameEl.textContent = fp.name;
    nameEl.style.margin = "0 0 4px 0";
    nameEl.style.fontSize = "1.1rem";
    nameEl.style.fontWeight = "600";
    overlay.appendChild(nameEl);

    const subtitleEl = document.createElement("p");
    subtitleEl.textContent = fp.description;
    subtitleEl.style.margin = "0";
    subtitleEl.style.fontSize = "0.9rem";
    subtitleEl.style.opacity = "0.7";
    overlay.appendChild(subtitleEl);

    playlistCard.appendChild(overlay);

    // Hover effect
    playlistCard.addEventListener("mouseenter", () => {
      playlistCard.style.transform = "translateY(-4px)";
      playlistCard.style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)";
    });
    playlistCard.addEventListener("mouseleave", () => {
      playlistCard.style.transform = "translateY(0)";
      playlistCard.style.boxShadow = "none";
    });

    // Click pour afficher les projets en liste
    playlistCard.addEventListener("click", () => {
      renderPlaylist(fp.id, fp.name, fp.description);
    });

    playlistsGrid.appendChild(playlistCard);
  });

  // Section "Récents"
  const recent = [...projects].slice(0, 12);
  const h3 = document.createElement("h3");
  h3.textContent = "Derniers projets";
  view.appendChild(h3);
  const row2 = document.createElement("div");
  row2.className = "row";
  recent.forEach((p) => row2.appendChild(card(p)));
  view.appendChild(row2);
}

// Page bibliothèque avec filtrage optionnel
function renderLibrary(filterTerm = "") {
  setViewTitle("Tous mes projets", "");
  view.innerHTML = "";

  const hint = document.createElement("div");
  hint.className = "hint";
  view.appendChild(hint);

  const grid = document.createElement("section");
  grid.className = "grid";
  view.appendChild(grid);

  // Filtrage des projets
  const data = projects.filter((p) => {
    if (!filterTerm) return true;
    const t = filterTerm.toLowerCase();
    return (
      p.title.toLowerCase().includes(t) ||
      (p.category || "").toLowerCase().includes(t) ||
      String(p.year).includes(t)
    );
  });

  hint.textContent = `${data.length} projet${data.length > 1 ? "s" : ""}`;
  data.forEach((p) => grid.appendChild(card(p)));
}

// Page playlists avec deux modes de tri
function renderPlaylists(mode = "type") {
  const subtitle =
    mode === "annee" ? "Triés par année" : "Triés par type de projet";
  setViewTitle("Projets par catégorie", subtitle);
  view.innerHTML = "";

  // Onglets de navigation
  const tabs = document.createElement("div");
  tabs.className = "row";

  const t2 = document.createElement("button");
  t2.className = "btn";
  t2.textContent = "Type de projet";
  t2.onclick = () => fadeTransition(() => renderPlaylists("type"));
  if (mode === "type") t2.classList.add("btn-active");

  const t1 = document.createElement("button");
  t1.className = "btn";
  t1.textContent = "Année";
  t1.onclick = () => fadeTransition(() => renderPlaylists("annee"));
  if (mode === "annee") t1.classList.add("btn-active");

  tabs.append(t2, t1);
  view.appendChild(tabs);

  // Rendu selon le mode sélectionné
  if (mode === "annee") {
    years.forEach((y) => {
      const h = document.createElement("h3");
      h.textContent = y;
      view.appendChild(h);
      const row = document.createElement("div");
      row.className = "row";
      projects
        .filter((p) => p.year === y)
        .forEach((p) => row.appendChild(card(p)));
      view.appendChild(row);
    });
  } else if (mode === "type") {
    categories.forEach((c) => {
      const h = document.createElement("h3");
      h.textContent = c;
      view.appendChild(h);
      const row = document.createElement("div");
      row.className = "row";
      projects
        .filter((p) => p.category === c)
        .forEach((p) => row.appendChild(card(p)));
      view.appendChild(row);
    });
  }
}

// Page à propos
function renderAbout() {
  setViewTitle("Contact", "Me contacter");
  view.innerHTML = `
    <section class="about-section">
      <div class="about-inner">
        <h2 class="about-title">Morgan Duchamp</h2>
        <p class="about-text">
          Étudiant en deuxième année de BUT MMI (Métiers du Multimédia et de l'Internet) à l'IUT de Sénart/Fontainebleau, je suis passionné par le développement web et la création de solutions numériques innovantes.
          <br><br>
          Je recherche une alternance dans le domaine du graphisme, de la photographie ou du web du 1<sup>er</sup> septembre 2026 au 31 août 2027.
          <br><br>
          Mes compétences en Web : HTML, CSS, Javascript, PHP, MySQL.<br>
          Mes compétences en Design : Photoshop, Illustrator, Premiere Pro, XD, InDesign.<br><br>
          Localisé en Île-de-France, sur la commune de Montgeron, en Essonne.<br><br>
          Si vous voulez me contacter :<br>
          - Par email : <a href="mailto:morganduchamppro@icloud.com">morganduchamppro@icloud.com</a><br>
          - Par téléphone : <a href="tel:+33651728371">+33 6 51 72 83 71</a>
        </p>
        <div class="about-actions">
          <a href="files/CV_MorganDuchamp.pdf" class="btn about-cv" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm8 2H4v2h16v-2z"/>
            </svg>
            Voir mon CV
          </a>
          <a href="https://www.linkedin.com/in/morgan-duchamp" class="btn about-li" target="_blank" rel="noopener" title="Mon profil LinkedIn">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
              <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.5h5V23H0zM8 8.5h4.8v2h.07c.67-1.2 2.3-2.47 4.73-2.47 5.06 0 6 3.33 6 7.65V23h-5v-6.5c0-1.55-.03-3.55-2.17-3.55-2.18 0-2.51 1.7-2.51 3.44V23H8z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  `;
}

/* ============================================
   TRANSITION EN FONDU ENTRE PAGES
   Comportement différent mobile/desktop
   ============================================ */
function fadeTransition(callback) {
  const app = document.getElementById("app");
  const isMobile = window.matchMedia("(max-width: 900px)").matches;

  if (isMobile) {
    // Mobile : changement de contenu au milieu du fade (quand l'écran est blanc)
    app.classList.add("fade-out");
    setTimeout(() => {
      callback();
    }, 125); // Milieu de la transition
    setTimeout(() => {
      app.classList.remove("fade-out");
      app.classList.add("fade-in");
      setTimeout(() => app.classList.remove("fade-in"), 500);
    }, 250);
  } else {
    // Desktop : changement de contenu après le fade-out complet
    app.classList.add("fade-out");
    setTimeout(() => {
      callback();
      app.classList.remove("fade-out");
      app.classList.add("fade-in");
      setTimeout(() => app.classList.remove("fade-in"), 500);
    }, 250);
  }
}

/* ============================================
   NAVIGATION SIDEBAR (DESKTOP)
   ============================================ */
const sidebar = document.getElementById("primary");
sidebar.addEventListener("click", (e) => {
  const a = e.target.closest(".item");
  if (!a) return;
  e.preventDefault();

  // Mise à jour de l'état actif
  sidebar
    .querySelectorAll(".item")
    .forEach((i) => i.classList.remove("active"));
  a.classList.add("active");

  const v = a.dataset.view;
  navigate(v);
});

// Fonction de navigation centralisée
function navigate(v) {
  fadeTransition(() => {
    if (v === "home") {
      renderHome();
    } else if (v === "library") {
      renderLibrary(document.getElementById("sidebar-q").value);
    } else if (v === "playlists") {
      renderPlaylists("type");
    } else if (v === "about") {
      renderAbout();
    }
  });
}

/* ============================================
   NAVIGATION MOBILE (BOTTOM BAR)
   ============================================ */
const mnav = document.querySelector(".mobile-nav");
const mnavBtns = document.querySelectorAll(".mobile-nav .mnav-btn[data-view]");
const mnavSearchToggle = document.getElementById("mnav-search-toggle");
const mnavSearchClose = document.getElementById("mnav-search-close");
const mnavSearchInput = document.getElementById("mobile-search-input");

// Met à jour l'état actif des boutons mobile
function setMNavActive(view) {
  mnavBtns.forEach((b) =>
    b.classList.toggle("active", b.dataset.view === view)
  );
}

// Navigation via les boutons mobile
mnavBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const v = btn.dataset.view;

    // Fermeture de la recherche si ouverte
    mnav.classList.remove("searching");

    if (typeof fadeTransition === "function") {
      fadeTransition(() => {
        navigate(v);
      });
    } else {
      navigate(v);
    }
    setMNavActive(v);
  });
});

// Ouverture de la recherche mobile avec animation
mnavSearchToggle.addEventListener("click", () => {
  mnav.classList.add("pre-search");
  requestAnimationFrame(() => {
    mnav.classList.add("searching");
    mnav.classList.remove("pre-search");
  });

  setMNavActive("home");
  mnavSearchInput.value = "";
  requestAnimationFrame(() => mnavSearchInput.focus());
});

// Fermeture de la recherche mobile
function closeMobileSearch() {
  mnav.classList.remove("searching");
  setTimeout(() => {
    mnavSearchInput.value = "";
  }, 450);
}

mnavSearchClose.addEventListener("click", closeMobileSearch);

// Saisie en temps réel dans la recherche mobile
mnavSearchInput.addEventListener("input", () => {
  const term = mnavSearchInput.value;
  if (typeof fadeTransition === "function") {
    fadeTransition(() => {
      renderLibrary(term);
    });
  } else {
    renderLibrary(term);
  }
  setMNavActive("library");
});

// Touche Échap pour fermer la recherche
mnavSearchInput.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileSearch();
  }
});

// Synchronise l'état de la nav mobile lors d'appels externes à navigate()
(function patchNavigateForMNav() {
  if (typeof navigate !== "function") return;
  const __oldNavigate = navigate;
  window.navigate = function (v) {
    __oldNavigate(v);
    setMNavActive(v);
    if (v !== "library") mnav.classList.remove("searching");
  };
})();

/* ============================================
   SYSTÈME DE RECHERCHE (DESKTOP)
   ============================================ */

// Détecte le mode mobile
function isMobile() {
  return window.matchMedia("(max-width: 900px)").matches;
}

// Détecte si la sidebar est repliée
function isAsideCollapsed() {
  return document.body.classList.contains("aside-collapsed");
}

// Références des champs de recherche
const sidebarSearch = document.getElementById("sidebar-q");
const topSearch = document.getElementById("top-search");
const topSearchInp = document.getElementById("top-search-input");

// Synchronise les valeurs entre les deux champs
function syncSearchValues(fromEl) {
  const v = (fromEl?.value || "").trim();
  if (fromEl !== sidebarSearch && sidebarSearch) sidebarSearch.value = v;
  if (fromEl !== topSearchInp && topSearchInp) topSearchInp.value = v;
}

// Affiche/masque la recherche top-right selon l'état
function updateTopSearchVisibility() {
  const showTop = !isMobile() && isAsideCollapsed();
  if (topSearch) {
    topSearch.setAttribute("aria-hidden", showTop ? "false" : "true");
  }
}

updateTopSearchVisibility();
window.addEventListener("resize", updateTopSearchVisibility);

// Gestion intelligente de la recherche selon la page active
function handleSearchInput(term) {
  const t = term.trim();
  const active = document.querySelector(".item.active")?.dataset.view;

  // Si on est sur playlists : filtrage sur place
  if (active === "playlists") {
    const visibleProjects = Array.from(document.querySelectorAll(".card"))
      .map((card) => {
        const slug = card.dataset.slug;
        return projects.find((p) => window.slug(p.title) === slug);
      })
      .filter(Boolean);

    const filtered = visibleProjects.filter((p) => {
      const term = t.toLowerCase();
      return (
        p.title.toLowerCase().includes(term) ||
        (p.category || "").toLowerCase().includes(term) ||
        String(p.year).includes(term)
      );
    });

    // Affiche/masque les cartes selon le filtre
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const slug = card.dataset.slug;
      const match = filtered.find((p) => window.slug(p.title) === slug);
      card.style.display = match ? "" : "none";
    });

    // Masque les sections vides
    const allH3 = document.querySelectorAll("#view h3");
    allH3.forEach((h3) => {
      let nextRow = h3.nextElementSibling;
      while (nextRow && !nextRow.classList.contains("row")) {
        nextRow = nextRow.nextElementSibling;
      }

      if (nextRow && nextRow.classList.contains("row")) {
        const visibleCards = nextRow.querySelectorAll(
          '.card:not([style*="display: none"])'
        );
        if (visibleCards.length === 0) {
          h3.style.display = "none";
          nextRow.style.display = "none";
        } else {
          h3.style.display = "";
          nextRow.style.display = "";
        }
      }
    });

    return;
  }

  // Pour les autres pages : navigation vers la bibliothèque
  if (typeof fadeTransition === "function") {
    fadeTransition(() => {
      document
        .querySelectorAll(".item")
        .forEach((i) => i.classList.remove("active"));
      const libItem = document.querySelector('[data-view="library"]');
      if (libItem) libItem.classList.add("active");
      renderLibrary(t);
    });
  } else {
    document
      .querySelectorAll(".item")
      .forEach((i) => i.classList.remove("active"));
    const libItem = document.querySelector('[data-view="library"]');
    if (libItem) libItem.classList.add("active");
    renderLibrary(t);
  }
}

// Écouteurs pour la recherche top-right
if (topSearchInp) {
  topSearchInp.addEventListener("input", () => {
    syncSearchValues(topSearchInp);
    const active = document.querySelector(".item.active")?.dataset.view;
    if (active === "library") renderLibrary(topSearchInp.value);
  });

  topSearchInp.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchInput(topSearchInp.value);
    }
  });
}

// Écouteurs pour la recherche sidebar
if (sidebarSearch) {
  sidebarSearch.addEventListener("input", () => {
    syncSearchValues(sidebarSearch);
    const active = document.querySelector(".item.active")?.dataset.view;
    if (active === "library") renderLibrary(sidebarSearch.value);
  });

  sidebarSearch.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearchInput(sidebarSearch.value);
    }
  });
}

// Synchronisation lors du toggle de la sidebar
const sidebarToggleBtn = document.getElementById("sidebarToggle");
if (sidebarToggleBtn) {
  const __origClick = sidebarToggleBtn.onclick;
  sidebarToggleBtn.addEventListener(
    "click",
    () => {
      if (typeof __origClick === "function") __origClick();
      setTimeout(() => {
        updateTopSearchVisibility();
        syncSearchValues(isAsideCollapsed() ? sidebarSearch : topSearchInp);
      }, 0);
    },
    { capture: false }
  );
}

// Patch de navigate() pour maintenir la visibilité de la recherche
(function patchNavigateForTopSearch() {
  if (typeof navigate !== "function") return;
  const __nav = navigate;
  window.navigate = function (v) {
    __nav(v);
    updateTopSearchVisibility();
  };
})();

/* ============================================
   PLAYLISTS RAPIDES (SIDEBAR)
   ============================================ */
const quick = document.getElementById("quick-playlists");
quick.addEventListener("click", (e) => {
  const a = e.target.closest("[data-quick]");
  if (!a) return;
  e.preventDefault();

  const type = a.dataset.quick;
  const val = a.dataset.value;

  fadeTransition(() => {
    if (type === "year") {
      setViewTitle(`Projets ${val}`, "");
      view.innerHTML = "";
      const h = document.createElement("h3");
      h.textContent = val;
      view.appendChild(h);
      const row = document.createElement("div");
      row.className = "row";
      projects
        .filter((p) => p.year == val)
        .forEach((p) => row.appendChild(card(p)));
      view.appendChild(row);
    } else if (type === "category") {
      setViewTitle(val, "");
      view.innerHTML = "";
      const h = document.createElement("h3");
      h.textContent = val;
      view.appendChild(h);
      const row = document.createElement("div");
      row.className = "row";
      projects
        .filter((p) => p.category === val)
        .forEach((p) => row.appendChild(card(p)));
      view.appendChild(row);
    }

    // Mise à jour de la navigation active
    document.querySelector('[data-view="playlists"]').classList.add("active");
    document.querySelector('[data-view="home"]').classList.remove("active");
    document.querySelector('[data-view="library"]').classList.remove("active");
  });
});

// Recherche temps réel dans la sidebar (legacy)
const q = document.getElementById("sidebar-q");
q.addEventListener("input", () => {
  const active = document.querySelector(".item.active")?.dataset.view;
  if (active === "library") {
    renderLibrary(q.value);
  }
});

/* ============================================
   MODAL DE DÉTAILS DU PROJET
   ============================================ */
const modal = document.getElementById("modal");
const modalCover = document.getElementById("modal-cover");
const modalTitle = document.getElementById("modal-title");
const modalYear = document.getElementById("modal-year");
const modalDesc = document.getElementById("modal-desc");
const modalLinks = document.getElementById("modal-links");

// Variable globale pour stocker le projet actuel
let currentProject = null;
let currentPlaylistId = null;
let currentProjectIndex = 0;

/* ============================================
   VARIABLES GLOBALES POUR LA GALERIE
   ============================================ */
let currentGalleryIndex = 0; // Index de l'image actuelle

// Ouvre la modal avec les détails du projet
// Affiche la modal avec les données du projet (sans relancer la lecture)
function displayProjectModal(p) {
  currentProject = p;
  currentGalleryIndex = 0;

  updateGalleryDisplay(p);
  
  modalTitle.textContent = p.title;
  modalYear.textContent = `${p.category} • ${p.year}`;
  modalDesc.textContent = p.description || "";
  modalLinks.innerHTML = (p.links || [])
    .map(
      (l) =>
        `<a class=\"btn\" href=\"${l.url}\" target=\"_blank\" rel=\"noopener\">${l.label}</a>`
    )
    .join("");

  modal.showModal();
}

function openProject(p) {
  // Stockage du projet actuel
  displayProjectModal(p);

  // Mise à jour du lecteur en bas
  updateNowPlaying(p);
  
  // Mettre le bouton play/pause en "play" (en cours de lecture)
  playing = true;
  iconPlay.style.display = "none";
  iconPause.style.display = "block";

  pulseProgress();
}

// Affiche l'image courante de la galerie
function updateGalleryDisplay(p) {
  const covers = p.covers || [];
  const totalImages = covers.length;
  
  // Afficher l'image courante
  if (totalImages > 0) {
    const imgUrl = covers[currentGalleryIndex];
    modalCover.style.backgroundImage = `url('${imgUrl}')`;
  } else {
    // Fallback: afficher le dégradé si pas d'image
    modalCover.style.backgroundImage = grad(p.title);
  }
  
  // Afficher/masquer les flèches et le compteur
  const galleryPrev = document.getElementById("gallery-prev");
  const galleryNext = document.getElementById("gallery-next");
  const galleryCounter = document.getElementById("gallery-counter");
  const galleryCurrent = document.getElementById("gallery-current");
  const galleryTotal = document.getElementById("gallery-total");
  
  if (totalImages > 1) {
    galleryPrev.style.display = "flex";
    galleryNext.style.display = "flex";
    galleryCounter.style.display = "block";
    galleryCurrent.textContent = currentGalleryIndex + 1;
    galleryTotal.textContent = totalImages;
  } else {
    galleryPrev.style.display = "none";
    galleryNext.style.display = "none";
    galleryCounter.style.display = "none";
  }
}

// Navigation entre les images
function nextGalleryImage(p) {
  const covers = p.covers || [];
  if (covers.length <= 1) return;
  
  currentGalleryIndex = (currentGalleryIndex + 1) % covers.length;
  updateGalleryDisplay(p);
}

function prevGalleryImage(p) {
  const covers = p.covers || [];
  if (covers.length <= 1) return;
  
  currentGalleryIndex = (currentGalleryIndex - 1 + covers.length) % covers.length;
  updateGalleryDisplay(p);
}

// Met à jour le lecteur en bas sans ouvrir la modal
function updateNowPlaying(p) {
  const cover = p.cover ? `url('${p.cover}')` : grad(p.title);
  
  currentProject = p;
  document.getElementById("mini-art").style.backgroundImage = cover;
  document.getElementById("mini-title").textContent = p.title;
  document.getElementById("mini-sub").textContent = `${p.category} • ${p.year}`;
}

// Fermeture de la modal
document.getElementById("close").addEventListener("click", () => {
  modal.close();
  stopProgress();
});

// Flèches de navigation galerie
document.getElementById("gallery-prev").addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentProject) prevGalleryImage(currentProject);
});

document.getElementById("gallery-next").addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentProject) nextGalleryImage(currentProject);
});

// Navigation au clavier dans la galerie (flèches gauche/droite)
document.addEventListener("keydown", (e) => {
  if (!modal.open || !currentProject) return;
  
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    prevGalleryImage(currentProject);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    nextGalleryImage(currentProject);
  }
});

/* ============================================
   LIGHTBOX (AFFICHAGE FULLSCREEN DE L'IMAGE)
   ============================================ */
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");
const lightboxCounter = document.getElementById("lightbox-counter");
const lightboxCurrent = document.getElementById("lightbox-current");
const lightboxTotal = document.getElementById("lightbox-total");
let lightboxGalleryIndex = 0;

// Ouvre la lightbox au clic sur l'image
const modalCoverEl = document.getElementById("modal-cover");
if (modalCoverEl) {
  modalCoverEl.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!currentProject || !currentProject.covers || currentProject.covers.length === 0) return;
    
    lightboxGalleryIndex = currentGalleryIndex;
    modal.close();
    openLightbox(currentProject);
  });
}

// Ouvre la lightbox avec une image spécifique
function openLightbox(p) {
  const covers = p.covers || [];
  if (covers.length === 0) return;
  
  lightbox.style.display = "flex";
  updateLightboxDisplay(p);
  document.body.style.overflow = "hidden";
}

// Ferme la lightbox et rouvre la modal
function closeLightbox() {
  lightbox.style.display = "none";
  document.body.style.overflow = "auto";
  if (currentProject) {
    openProject(currentProject);
  }
}

// Affiche l'image courante dans la lightbox
function updateLightboxDisplay(p) {
  const covers = p.covers || [];
  if (covers.length === 0) return;
  
  const imageUrl = covers[lightboxGalleryIndex];
  lightboxImage.src = imageUrl;
  
  lightboxCurrent.textContent = lightboxGalleryIndex + 1;
  lightboxTotal.textContent = covers.length;
}

// Navigation image suivante dans lightbox
function nextLightboxImage(p) {
  const covers = p.covers || [];
  if (covers.length <= 1) return;
  
  lightboxGalleryIndex = (lightboxGalleryIndex + 1) % covers.length;
  updateLightboxDisplay(p);
}

// Navigation image précédente dans lightbox
function prevLightboxImage(p) {
  const covers = p.covers || [];
  if (covers.length <= 1) return;
  
  lightboxGalleryIndex = (lightboxGalleryIndex - 1 + covers.length) % covers.length;
  updateLightboxDisplay(p);
}

// Bouton fermer lightbox
document.getElementById("lightbox-close").addEventListener("click", closeLightbox);

// Flèches de navigation lightbox
document.getElementById("lightbox-prev").addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentProject) prevLightboxImage(currentProject);
});

document.getElementById("lightbox-next").addEventListener("click", (e) => {
  e.stopPropagation();
  if (currentProject) nextLightboxImage(currentProject);
});

// Navigation au clavier et fermeture lightbox
document.addEventListener("keydown", (e) => {
  if (lightbox.style.display !== "flex" || !currentProject) return;
  
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    prevLightboxImage(currentProject);
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    nextLightboxImage(currentProject);
  } else if (e.key === "Escape") {
    e.preventDefault();
    closeLightbox();
  }
});

// Fermer la lightbox en cliquant sur le backdrop
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) {
    closeLightbox();
  }
});

// Rendre la barre du lecteur cliquable pour ouvrir la modal
const nowBar = document.querySelector(".now");
if (nowBar) {
  nowBar.style.cursor = "pointer";
  nowBar.addEventListener("click", (e) => {
    // Ne pas ouvrir si on clique sur les boutons de contrôle
    if (e.target.closest(".controls")) return;
    
    // Ouvrir la modal du projet actuel si disponible
    if (currentProject) {
      openProject(currentProject);
    }
  });
}

/* ============================================
   LECTEUR AUDIO SIMULÉ (BARRE DE PROGRESSION)
   ============================================ */
let playing = false;
let progressTimer = null;
const bar = document.getElementById("mini-bar");
const btnPlay = document.getElementById("btn-play");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");

// Initialise la barre à vide au chargement
if (bar) {
  bar.style.width = "0%";
}

// Animation de progression
function pulseProgress() {
  bar.style.transition = "none";
  bar.style.width = "0%";
  requestAnimationFrame(() => {
    bar.style.transition = "width 6s var(--transition)";
    bar.style.width = "85%";
  });
}

// Démarre la lecture
function startProgress() {
  if (progressTimer) return;
  playing = true;
  iconPlay.style.display = "none";
  iconPause.style.display = "block";
  pulseProgress();
  progressTimer = setInterval(() => {
    pulseProgress();
  }, 6500);
}

// Arrête la lecture
function stopProgress() {
  playing = false;
  iconPlay.style.display = "block";
  iconPause.style.display = "none";
  clearInterval(progressTimer);
  progressTimer = null;
}

// Bouton play/pause
btnPlay.addEventListener("click", () => {
  // Ne rien faire si aucun projet n'est ouvert
  if (!currentProject) return;
  
  if (playing) {
    stopProgress();
  } else {
    // Afficher la modal avec le bon projet
    displayProjectModal(currentProject);
    startProgress();
  }
});

// Bouton précédent
document.getElementById("btn-prev").addEventListener("click", () => {
  if (!currentProject || !currentPlaylistId) return;
  
  const playlistProjects = projects.filter(
    (p) => p.featured_project_id === currentPlaylistId
  );
  
  currentProjectIndex = (currentProjectIndex - 1 + playlistProjects.length) % playlistProjects.length;
  updateNowPlaying(playlistProjects[currentProjectIndex]);
});

// Bouton suivant
document.getElementById("btn-next").addEventListener("click", () => {
  if (!currentProject || !currentPlaylistId) return;
  
  const playlistProjects = projects.filter(
    (p) => p.featured_project_id === currentPlaylistId
  );
  
  currentProjectIndex = (currentProjectIndex + 1) % playlistProjects.length;
  updateNowPlaying(playlistProjects[currentProjectIndex]);
});

/* ============================================
   GESTION RESPONSIVE DU LECTEUR
   ============================================ */

// Détecte la largeur mobile
function isMobileWidth() {
  return window.matchMedia("(max-width: 900px)").matches;
}

// Patch de pulseProgress pour désactiver l'animation en mobile
const __pulseProgressOrig =
  typeof pulseProgress === "function" ? pulseProgress : null;
if (__pulseProgressOrig) {
  window.pulseProgress = function () {
    if (isMobileWidth()) return;
    __pulseProgressOrig();
  };
}

// Arrête la lecture lors du passage en mobile
function updatePlayerResponsive() {
  if (typeof stopProgress === "function" && isMobileWidth()) {
    stopProgress();
  }
}

window.addEventListener("resize", updatePlayerResponsive);
updatePlayerResponsive();

/* ============================================
   INITIALISATION
   ============================================ */
navigate("home");
