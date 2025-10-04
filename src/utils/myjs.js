// src/utils/myjs.js

// Fallback for poster URLs
export const posterURL = (url) =>
  url && url !== "N/A" ? url : "https://placehold.co/300x450?text=No+Image";

// Debounce helper
export const makeDebounce = () => {
  let t;
  return (q, fn) => {
    clearTimeout(t);
    t = setTimeout(() => fn(q), 400);
  };
};

// OMDb search
export async function searchOMDb(query) {
  const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const j = await r.json();
  return Array.isArray(j.Search) ? j.Search : [];
}

// Optional: fetch full movie details
export async function getOMDbDetails(imdbId) {
  const r = await fetch(`/api/title/${imdbId}`);
  return await r.json();
}
