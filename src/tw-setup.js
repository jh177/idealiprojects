// Runs after the CDN script, so `tailwind` exists.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#00522d", accent: "#db3c8a" },
        cream: "#fff8f6",
        blush: "#fce5df",
        lilac: "#d1cfe4",
        bubblegum: "#f29ebd",
        cotton: "#e878b2",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        display: [
          "Anton",
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: { card: "0 8px 30px rgba(0,0,0,.08)" },
    },
  },
};
