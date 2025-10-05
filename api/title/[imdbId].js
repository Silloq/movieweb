import fetch from "node-fetch";
import tmdbScrape from "vidsrc.ts";

export default async function handler(req, res) {
  const { imdbId, type = "movie", season, episode } = req.query;

  if (!imdbId) {
    return res.status(400).json({ error: "Missing imdbId" });
  }

  try {
    // 1. Fetch OMDb details
    const omdbUrl = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${imdbId}&plot=full`;
    const omdbRes = await fetch(omdbUrl);
    const omdbData = await omdbRes.json();

    // 2. Convert IMDb → TMDB
    const tmdbUrl = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${process.env.TMDB_KEY}&external_source=imdb_id`;
    const tmdbRes = await fetch(tmdbUrl);
    const tmdbJson = await tmdbRes.json();

    const tmdbId =
      tmdbJson.movie_results?.[0]?.id ||
      tmdbJson.tv_results?.[0]?.id;

    if (!tmdbId) {
      return res.status(404).json({ error: "TMDB id not found" });
    }

    // 3. Get streaming sources from vidsrc.ts
    const streams = await tmdbScrape(
      tmdbId,
      type,
      season ? Number(season) : undefined,
      episode ? Number(episode) : undefined
    );

    // 4. Combine into one response
    res.status(200).json({
      omdb: omdbData,
      tmdbId,
      streams
    });
  } catch (err) {
    console.error("Title/stream route error:", err);
    res.status(500).json({ error: "title_or_stream_failed", details: String(err) });
  }
}
