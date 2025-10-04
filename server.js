import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());

const OMDB = "https://www.omdbapi.com/";

// ================================
// 🔍 Search route
// ================================
app.get("/api/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ Search: [] });

  try {
    const url = `${OMDB}?apikey=${process.env.OMDB_KEY}&s=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Search route error:", err);
    res.status(500).json({ error: "search_failed" });
  }
});

// ================================
// 🎬 Movie details route
// ================================
app.get("/api/title/:imdbId", async (req, res) => {
  const { imdbId } = req.params;

  try {
    const url = `${OMDB}?apikey=${process.env.OMDB_KEY}&i=${imdbId}&plot=full`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Title route error:", err);
    res.status(500).json({ error: "title_failed" });
  }
});

// ================================
// 🏠 Homepage (25 featured movies)
// ================================
app.get("/api/home", async (req, res) => {
  const titles = [
    "Oppenheimer",
    "Dune: Part Two",
    "Barbie",
    "Spider-Man: Across the Spider-Verse",
    "The Batman",
    "John Wick: Chapter 4",
    "Guardians of the Galaxy Vol. 3",
    "Interstellar",
    "Inception",
    "Avengers: Endgame",
    "Tenet",
    "The Matrix",
    "The Dark Knight",
    "Avatar: The Way of Water",
    "Black Panther",
    "Doctor Strange in the Multiverse of Madness",
    "Captain America: Civil War",
    "Iron Man",
    "Thor: Ragnarok",
    "The Flash",
    "Shang-Chi and the Legend of the Ten Rings",
    "Eternals",
    "No Time to Die",
    "Top Gun: Maverick",
    "The Super Mario Bros. Movie"
  ];

  try {
    const results = await Promise.all(
      titles.map(async (t) => {
        const r = await fetch(
          `${OMDB}?apikey=${process.env.OMDB_KEY}&t=${encodeURIComponent(t)}&plot=short`
        );
        const j = await r.json();
        return j.Response === "True" ? j : null;
      })
    );
    res.json(results.filter(Boolean).slice(0, 25)); // ✅ 25 max
  } catch (err) {
    console.error("Home route error:", err);
    res.status(500).json({ error: "Failed to fetch OMDb data" });
  }
});


const port = process.env.PORT || 5174;
app.listen(port, () => console.log(`✅ Server running at http://localhost:${port}`));
