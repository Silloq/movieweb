import tmdbScrape from "vidsrc.ts";
import fetch from "node-fetch";

export default async function handler(req, res) {
  const { imdbId, type = "movie", season, episode } = req.query;

  if (!imdbId) {
    return res.status(400).json({ error: "Missing imdbId" });
  }

  try {
    // Step 1: Convert IMDb → TMDB
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?api_key=${process.env.TMDB_KEY}&external_source=imdb_id`
    );
    const tmdbJson = await tmdbRes.json();

    const tmdbId =
      tmdbJson.movie_results?.[0]?.id ||
      tmdbJson.tv_results?.[0]?.id;

    if (!tmdbId) {
      return res.status(404).json({ error: "TMDB id not found" });
    }

    // Step 2: Call vidsrc.ts
    const data = await tmdbScrape(
      tmdbId,
      type,
      season ? Number(season) : undefined,
      episode ? Number(episode) : undefined
    );

    res.status(200).json(data);
  } catch (err) {
    console.error("Vidsrc route error:", err);
    res.status(500).json({ error: "vidsrc_failed", details: String(err) });
  }
}
