import fetch from "node-fetch";

export default async function handler(req, res) {
  const { q } = req.query;
  if (!q) return res.status(200).json({ Search: [] });

  const url = `https://www.omdbapi.com/?apikey=${process.env.OMDB_KEY}&s=${encodeURIComponent(q)}`;
  const r = await fetch(url);
  const data = await r.json();
  res.status(200).json(data);
}
