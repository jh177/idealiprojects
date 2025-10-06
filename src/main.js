// src/main.js
export function initSite() {
  const header = document.querySelector("header");
  const navMenu = document.getElementById("nav-menu"); // desktop nav
  const hamburger = document.getElementById("hamburger-menu");
  const mobileMenu = document.getElementById("nav-menu-mobile"); // slide-in drawer
  const footer = document.getElementById("site-footer");
  const scrollUpBtn = document.getElementById("scroll-up-btn");

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
}
