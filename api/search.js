import fetch from "node-fetch";

export default async function handler(req, res) {
  const q = (req.query.q || "").trim();
  if (!q) {
    return res.status(200).json({ Search: [] });
  }

  try {
    const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${encodeURIComponent(q)}`;
    const r = await fetch(url);
    const data = await r.json();
    res.status(200).json(data);
  } catch (err) {
    console.error("Search route error:", err);
    res.status(500).json({ error: "search_failed" });
  }
}
