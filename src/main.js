import { Application } from "@splinetool/runtime";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas3d");
  const formContainer = document.querySelector(".form-container");
  const scrollDownBtn = document.getElementById("scroll-down-btn");
  const formDiv = document.querySelector(".form-container");

  // Initial position of the button at the bottom of the viewport
  scrollDownBtn.addEventListener("click", function () {
    // Calculate the position of the form div relative to the viewport
    const formDivPosition =
      formDiv.getBoundingClientRect().top + window.scrollY;

    // Scroll the viewport to the top of the form div
    window.scrollTo({ top: formDivPosition, behavior: "smooth" });
  });

  const app = new Application(canvas);
  app
    .load("https://prod.spline.design/hDq-udgulNZRbaFB/scene.splinecode")
    .then(() => {
      // Defer the display of the form
      setTimeout(() => {
        formContainer.style.display = "flex";
        scrollDownBtn.style.visibility = "visible";
      }, 2000); // Adjust the delay as needed
    })
    .catch((error) => {
      console.error("Error loading canvas:", error);
    });
});
