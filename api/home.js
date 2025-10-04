import fetch from "node-fetch";

export default async function handler(req, res) {
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
          `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&t=${encodeURIComponent(t)}&plot=short`
        );
        const j = await r.json();
        return j.Response === "True" ? j : null;
      })
    );

    res.status(200).json(results.filter(Boolean).slice(0, 25));
  } catch (err) {
    console.error("Home route error:", err);
    res.status(500).json({ error: "home_failed" });
  }
}
