// Inject any element with [data-include] by fetching that path
export async function includePartials() {
  const nodes = Array.from(document.querySelectorAll("[data-include]"));
  await Promise.all(
    nodes.map(async (el) => {
      const url = el.getAttribute("data-include");
      try {
        const res = await fetch(url, { cache: "no-cache" });
        if (!res.ok) throw new Error(res.statusText);
        el.outerHTML = await res.text(); // replace placeholder with fetched HTML
      } catch (err) {
        console.error("Include failed:", url, err);
      }
    })
  );
}
