// Runs after the CDN script, so `tailwind` exists
tailwind.config = {
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0f172a", accent: "#ed2100" } },
      fontFamily: {
        sans: [
          "Jost",
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
      },
      boxShadow: { card: "0 8px 30px rgba(0,0,0,.08)" },
    },
  },
};
