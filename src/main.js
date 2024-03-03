import { Application } from "@splinetool/runtime";

const canvas = document.getElementById("canvas3d");
const contentWrapper = document.getElementById("content-wrapper");

// Hide the content initially
contentWrapper.style.display = "none";

const app = new Application(canvas);
app
  .load("https://prod.spline.design/hDq-udgulNZRbaFB/scene.splinecode")
  .then(() => {
    // When the canvas is fully loaded, display the content
    contentWrapper.style.display = "block";
  })
  .catch((error) => {
    console.error("Error loading canvas:", error);
  });
