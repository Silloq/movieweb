// src/pages/Player.jsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import Hls from "hls.js";

export default function Player() {
  const { imdbId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [streams, setStreams] = useState([]);
  const [selected, setSelected] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const videoRef = useRef(null);

  // Fetch movie info + streams
  useEffect(() => {
    if (!imdbId) return;
    (async () => {
      try {
        const res = await fetch(`/api/title?imdbId=${imdbId}`);
        const data = await res.json();
        setMovie(data.omdb ?? null);
        setStreams(data.streams ?? []);
        setSelected((data.streams && data.streams[0]) ?? null);
      } catch (err) {
        console.error("Failed to fetch movie/streams:", err);
      }
    })();
  }, [imdbId]);

  // HLS playback
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !selected?.url) return;

    // Cleanup previous Hls instance
    let hls;
    if (selected.url.includes(".m3u8") && !video.canPlayType("application/vnd.apple.mpegurl")) {
      hls = new Hls();
      hls.loadSource(selected.url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
    } else {
      video.src = selected.url;
      video.play().catch(() => {});
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [selected]);

  return (
    <div className="player-page">
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-and-nav">
            <h1 className="brand">
              <Link to="/" className="brand-link">CineStream</Link>
            </h1>
            <nav className="main-nav">
              {/* Add nav links if needed */}
            </nav>
          </div>
          <div className="header-actions">
            <div className="search">
              <input
                type="text"
                placeholder="Search movies…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {movie ? (
        <main className="container main">
          <h2 className="player-title">{movie.Title}</h2>
          <p className="muted">{movie.Year} • {movie.Genre} • {movie.Runtime}</p>
          <p className="player-plot">{movie.Plot}</p>

          <div className="video-wrap" style={{ marginTop: "1.5rem" }}>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              {selected ? (
                <video ref={videoRef} controls style={{ width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}>
                  Your browser does not support video.
                </video>
              ) : (
                <p>Loading stream...</p>
              )}
            </div>
          </div>

          {streams.length > 1 && (
            <div style={{ marginTop: "1rem" }}>
              <strong>Select Stream:</strong>
              <ul style={{ listStyle: "none", padding: 0 }}>
                {streams.map((s, idx) => (
                  <li key={idx} style={{ marginTop: "0.5rem" }}>
                    <button
                      style={{
                        padding: "6px 10px",
                        backgroundColor: selected === s ? "#222" : "#0f0f0f",
                        color: "#fff",
                        border: "1px solid #333",
                        borderRadius: 5,
                        cursor: "pointer",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onClick={() => setSelected(s)}
                    >
                      {s.provider || "Unknown"} {s.quality ? `• ${s.quality}` : ""}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
      )}
    </div>
  );
}
