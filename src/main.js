import { Application } from "@splinetool/runtime";

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("canvas3d");
  const formContainer = document.querySelector(".form-container");

  const app = new Application(canvas);
  app
    .load("https://prod.spline.design/hDq-udgulNZRbaFB/scene.splinecode")
    .then(() => {
      // Defer the display of the form
      setTimeout(() => {
        formContainer.style.display = "flex";
      }, 2000); // Adjust the delay as needed
    })
    .catch((error) => {
      console.error("Error loading canvas:", error);
    });
});
