document.addEventListener("DOMContentLoaded", () => {
  const formContainer = document.querySelector(".form-container");
  const aboutContainer = document.querySelector(".about-container");
  const filmTVContainer = document.querySelector("#film-tv");
  const digitalMediaContainer = document.querySelector("#digital-media");
  const header = document.querySelector("header");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-menu");
  const footer = document.getElementById("site-footer");

  // Show header & sections right away
  header.style.opacity = "1";
  header.style.display = "flex";
  aboutContainer.style.display = "flex";
  filmTVContainer.style.display = "flex";
  digitalMediaContainer.style.display = "flex";
  formContainer.style.display = "flex";

  // Scroll up button
  const scrollUpBtn = document.getElementById("scroll-up-btn");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      scrollUpBtn.style.display = "flex";
    } else {
      scrollUpBtn.style.display = "none";
    }

    if (window.scrollY > lastScrollY) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    if (window.scrollY === 0) {
      history.replaceState(null, null, " ");
    }

    lastScrollY = window.scrollY;

    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= pageHeight - 5) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  });

  scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      history.replaceState(null, null, " ");
    }, 500);
  });

  hamburgerMenu.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    navMenu.classList.toggle("active");
  });

  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
    });
  });

  const sections = document.querySelectorAll(".fade-section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        } else {
          entry.target.classList.remove("fade-in");
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => observer.observe(section));
});
