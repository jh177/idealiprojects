import { Application } from "@splinetool/runtime";

let isListenerAdded = false;

document.addEventListener("DOMContentLoaded", () => {
  if (isListenerAdded) return; // Prevent adding listener multiple times
  isListenerAdded = true;

  const canvas = document.getElementById("canvas3d");
  const formContainer = document.querySelector(".form-container");
  const aboutContainer = document.querySelector(".about-container");
  const teamContainer = document.querySelector(".team-container");
  const projectsContainer = document.querySelector(".projects-container");
  const header = document.querySelector("header");
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navMenu = document.getElementById("nav-menu");

  // Hide sections by default
  header.style.opacity = "0";
  aboutContainer.style.display = "none";
  teamContainer.style.display = "none";
  projectsContainer.style.display = "none";
  formContainer.style.display = "none";

  // Scroll up button
  const scrollUpBtn = document.getElementById("scroll-up-btn");
  const canvasSection = document.querySelector("#canvas3d");

  let lastScrollY = window.scrollY;

  // Show or hide scroll up button
  window.addEventListener("scroll", () => {
    if (window.scrollY > canvasSection.offsetHeight) {
      scrollUpBtn.style.display = "flex";
    } else {
      scrollUpBtn.style.display = "none";
    }

    if (window.scrollY > lastScrollY) {
      // Scrolling down, hide the header
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up, show the header
      header.style.transform = "translateY(0)";
    }
    lastScrollY = window.scrollY;
  });

  scrollUpBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Hamburger menu toggle
  hamburgerMenu.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Toggle the active class
    navMenu.classList.toggle("active");
  });

  // Close the navigation menu after clicking a menu item
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Close the menu by removing the active class
      navMenu.classList.remove("active");
    });
  });

  // Select all sections you want to fade
  const sections = document.querySelectorAll(".fade-section");

  // Options for the Intersection Observer
  const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the section is in view
  };

  // Callback for the Intersection Observer
  const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in"); // Add fade-in when in view
      } else {
        entry.target.classList.remove("fade-in"); // Remove fade-in when out of view
      }
    });
  };

  // Create an Intersection Observer
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // Observe each section
  sections.forEach((section) => {
    observer.observe(section);
  });

  // Initialize the Spline canvas
  const app = new Application(canvas);
  app
    .load("https://prod.spline.design/hDq-udgulNZRbaFB/scene.splinecode")
    .then(() => {
      setTimeout(() => {
        header.style.opacity = "1"; // Fade-in the header
        header.style.display = "flex";
        aboutContainer.style.display = "flex";
        teamContainer.style.display = "flex";
        projectsContainer.style.display = "flex";
        formContainer.style.display = "flex";
      }, 2000);
    })
    .catch((error) => {
      console.error("Error loading canvas:", error);
    });
});
