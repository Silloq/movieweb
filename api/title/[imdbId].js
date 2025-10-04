import fetch from "node-fetch";

export default async function handler(req, res) {
  const { imdbId } = req.query;

  if (!imdbId) {
    return res.status(400).json({ error: "Missing imdbId" });
  }

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&i=${imdbId}&plot=full`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Title route error:", err);
    res.status(500).json({ error: "title_failed" });
  }
}
