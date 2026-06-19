// src/main.js
export function initSite() {
  const header = document.querySelector("header");
  const navMenu = document.getElementById("nav-menu"); // desktop nav
  const hamburger = document.getElementById("hamburger-menu");
  const mobileMenu = document.getElementById("nav-menu-mobile"); // slide-in drawer
  const footer = document.getElementById("site-footer");
  const scrollUpBtn = document.getElementById("scroll-up-btn");
  initTrailerModal();

  // Mark header for white hamburger on the homepage only
  const isHome =
    window.location.pathname === "/" ||
    window.location.pathname.endsWith("/index.html");

  if (header) {
    if (isHome) header.classList.add("header--on-hero");
    else header.classList.remove("header--on-hero");
  }

  /* ------------------ viewport unit & header height fixes ------------------ */
  const setVh = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };
  setVh();
  window.addEventListener("resize", setVh);
  window.addEventListener("orientationchange", setVh);

  const setHeaderVar = () => {
    const h = (header && header.offsetHeight) || 64;
    document.documentElement.style.setProperty("--header-h", `${h}px`);
  };
  setHeaderVar();
  window.addEventListener("load", setHeaderVar);
  window.addEventListener("resize", setHeaderVar);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(setHeaderVar);
  }

  /* ------------------ mobile drawer: ensure it has items ------------------- */
  const hydrateMobileMenu = () => {
    if (!mobileMenu) return;

    // Ensure required structure exists
    let scrim = mobileMenu.querySelector(".nav-scrim");
    let panel = mobileMenu.querySelector(".nav-panel");
    let list = mobileMenu.querySelector(".mobile-list");

    if (!scrim) {
      scrim = document.createElement("a");
      scrim.href = "#";
      scrim.className = "nav-scrim";
      scrim.setAttribute("aria-hidden", "true");
      scrim.tabIndex = -1;
      mobileMenu.appendChild(scrim);
    }

    if (!panel) {
      panel = document.createElement("div");
      panel.className = "nav-panel";
      mobileMenu.appendChild(panel);
    }

    if (!panel.querySelector(".mobile-close")) {
      const closeBtn = document.createElement("a");
      closeBtn.href = "#";
      closeBtn.className = "mobile-close";
      closeBtn.setAttribute("aria-label", "Close menu");
      closeBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6l-12 12" />
        </svg>`;
      panel.appendChild(closeBtn);
    }

    if (!list) {
      list = document.createElement("ul");
      list.className = "mobile-list";
      panel.appendChild(list);
    }

    // If the list is empty (or partial shipped blank), clone desktop links
    if (list.children.length === 0 && navMenu) {
      const desktopLinks = Array.from(navMenu.querySelectorAll(".nav-link"));
      desktopLinks.forEach((a) => {
        const li = document.createElement("li");
        const cloned = a.cloneNode(true);
        // Remove desktop-only classnames if any
        cloned.className = "";
        li.appendChild(cloned);
        list.appendChild(li);
      });
    }

    // Wire "close on click" for scrim & close button (prevent default)
    const closeAnchors = mobileMenu.querySelectorAll(
      ".nav-scrim, .mobile-close"
    );
    closeAnchors.forEach((a) =>
      a.addEventListener("click", (e) => {
        e.preventDefault();
        closeMobileMenu();
      })
    );

    // Close after tapping any actual nav link (allow navigation)
    const navLinks = list.querySelectorAll("a");
    navLinks.forEach((a) =>
      a.addEventListener("click", () => {
        closeMobileMenu();
      })
    );
  };

  const openMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.add("active");
    document.body.style.overflow = "hidden";
    hamburger?.setAttribute("aria-expanded", "true");
  };

  const closeMobileMenu = () => {
    if (!mobileMenu) return;
    mobileMenu.classList.remove("active");
    document.body.style.overflow = "";
    hamburger?.setAttribute("aria-expanded", "false");
  };

  /* ------------------------- mobile drawer toggling ------------------------ */
  if (hamburger && mobileMenu) {
    // Ensure items exist before first open
    hydrateMobileMenu();

    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileMenu.classList.contains("active");
      if (isOpen) closeMobileMenu();
      else openMobileMenu();
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });

    // Click-away close (only if you somehow click outside scrim/panel)
    document.addEventListener("click", (e) => {
      if (!mobileMenu.classList.contains("active")) return;
      if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // On resize to desktop, force-close the drawer
    const mq = window.matchMedia("(min-width: 768px)");
    const handleMQ = () => {
      if (mq.matches) closeMobileMenu();
    };
    mq.addEventListener
      ? mq.addEventListener("change", handleMQ)
      : mq.addListener(handleMQ);
  }

  /* --------------------------- header hide on scroll ----------------------- */
  let lastY = window.scrollY;
  const delta = 8;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;

    if (scrollUpBtn) scrollUpBtn.style.display = y > 400 ? "flex" : "none";

    // Don't animate header if drawer is open
    const drawerOpen = mobileMenu && mobileMenu.classList.contains("active");

    if (!drawerOpen && header && Math.abs(y - lastY) > delta) {
      if (y > lastY && y > header.offsetHeight) {
        header.classList.add("header--hidden");
        if (navMenu) navMenu.classList.remove("active");
        document.body.style.overflow = "";
      } else {
        header.classList.remove("header--hidden");
      }
      lastY = y;
    }
  });

  /* ------------------------------ scroll up btn ---------------------------- */
  if (scrollUpBtn) {
    scrollUpBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------- fade-in sections --------------------------- */
  const sections = document.querySelectorAll(".fade-section");
  if (sections.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("fade-in");
        });
      },
      { threshold: 0.12 }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------------------------- slide-in reveal ---------------------------- */
  // Auto-stagger groups (3 items get 0, 90ms, 180ms, etc.)
  document.querySelectorAll("[data-reveal-group]").forEach((group) => {
    const kids = group.querySelectorAll("[data-reveal]");
    kids.forEach((el, i) =>
      el.style.setProperty("--reveal-delay", `${i * 90}ms`)
    );
  });

  // Observe reveal elements
  const revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length) {
    const rio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            rio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
    );
    revealEls.forEach((el) => rio.observe(el));
  }
}

function initTrailerModal() {
  applyVimeoTrailerRegistry();
  markImdbProjectLinks();

  const trailerCards = document.querySelectorAll("[data-vimeo-id], [data-vimeo-url], [data-youtube-id], [data-youtube-url]");
  if (!trailerCards.length) return;
  if (document.querySelector(".trailer-modal")) return;

  const modal = document.createElement("div");
  modal.className = "trailer-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="trailer-modal__backdrop" data-trailer-close></div>
    <div class="trailer-modal__panel" role="document">
      <button class="trailer-modal__close" type="button" data-trailer-close aria-label="Close trailer">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6l-12 12" />
        </svg>
      </button>
      <div class="trailer-modal__frame-wrap">
        <iframe class="trailer-modal__frame" title="Project trailer" allow="fullscreen; picture-in-picture" allowfullscreen></iframe>
      </div>
    </div>`;
  document.body.appendChild(modal);

  const frame = modal.querySelector(".trailer-modal__frame");
  const closeBtn = modal.querySelector(".trailer-modal__close");
  let previousFocus = null;

  const getTrailer = (card) => {
    const vimeoId = card.dataset.vimeoId;
    if (vimeoId) return { aspect: "vertical", src: `https://player.vimeo.com/video/${vimeoId}?badge=0&title=0&byline=0&portrait=0&dnt=1` };

    const vimeoMatch = (card.dataset.vimeoUrl || "").match(/(?:vimeo\.com\/(?:video\/)?|player\.vimeo\.com\/video\/)(\d+)/);
    if (vimeoMatch) return { aspect: "vertical", src: `https://player.vimeo.com/video/${vimeoMatch[1]}?badge=0&title=0&byline=0&portrait=0&dnt=1` };

    const youtubeId = card.dataset.youtubeId;
    if (youtubeId) return { aspect: "horizontal", src: `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1` };

    const youtubeMatch = (card.dataset.youtubeUrl || "").match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
    if (youtubeMatch) return { aspect: "horizontal", src: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1` };

    return null;
  };

  const openTrailer = (card) => {
    const trailer = getTrailer(card);
    if (!trailer) return;

    previousFocus = document.activeElement;
    const title = card.dataset.trailerTitle || card.querySelector("h3")?.textContent?.trim() || "Project trailer";
    frame.title = title;
    frame.src = trailer.src;
    modal.classList.toggle("trailer-modal--horizontal", trailer.aspect === "horizontal");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("trailer-modal-open");
    closeBtn.focus({ preventScroll: true });
  };

  const closeTrailer = () => {
    modal.classList.remove("is-open");
    modal.classList.remove("trailer-modal--horizontal");
    modal.setAttribute("aria-hidden", "true");
    frame.src = "";
    document.body.classList.remove("trailer-modal-open");
    if (previousFocus && typeof previousFocus.focus === "function") {
      previousFocus.focus({ preventScroll: true });
    }
  };

  trailerCards.forEach((card) => {
    card.classList.add("has-trailer");
    card.setAttribute("aria-label", `${card.dataset.trailerTitle || card.querySelector("h3")?.textContent?.trim() || "Project"} trailer`);

    const poster = card.querySelector(":scope > div:first-child");
    if (poster && !poster.querySelector(".trailer-pill")) {
      const trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "trailer-pill";
      trigger.textContent = "Watch trailer";
      trigger.setAttribute("aria-label", card.getAttribute("aria-label"));
      poster.appendChild(trigger);

      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        openTrailer(card);
      });
    }

    card.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
    });
  });

  modal.querySelectorAll("[data-trailer-close]").forEach((closeControl) => {
    closeControl.addEventListener("click", closeTrailer);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal.classList.contains("is-open")) {
      closeTrailer();
    }
  });
}

function applyVimeoTrailerRegistry() {
  const registry = window.digitalProjectTrailers;
  if (!registry || typeof registry !== "object") return;

  document.querySelectorAll("main a[href]").forEach((card) => {
    const imdbId = card.href.match(/title\/(tt\d+)/)?.[1];
    const trailer = imdbId ? registry[imdbId] : null;
    if (!trailer) return;

    if (/^\d+$/.test(trailer)) {
      card.dataset.vimeoId = trailer;
    } else {
      card.dataset.vimeoUrl = trailer;
    }
  });
}

function markImdbProjectLinks() {
  if (!window.digitalProjectTrailers) return;

  document.querySelectorAll("main a[href*='imdb.com/title/']").forEach((card) => {
    if (card.dataset.vimeoId || card.dataset.vimeoUrl) return;
    card.classList.add("has-imdb-link");

    const poster = card.querySelector(":scope > div:first-child");
    if (poster && !poster.querySelector(".imdb-pill")) {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "imdb-pill";
      pill.textContent = "View IMDb";
      poster.appendChild(pill);

      pill.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.open(card.href, card.target || "_self", "noopener");
      });
    }

    card.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
    });
  });
}
