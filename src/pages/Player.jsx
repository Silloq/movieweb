// src/pages/Player.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
export default function Player() {
  const { imdbId } = useParams();
  const [movie, setMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const r = await fetch(`/api/title/${imdbId}`);
      const j = await r.json();
      setMovie(j);
    })();
  }, [imdbId]);

  return (

    
    <div className="player-page">
       <header className="site-header">
        <div className="container header-inner">
          <div className="brand-and-nav">
            <h1 className="brand">
  <Link to="/" className="brand-link">CineStream</Link>
</h1>
            <nav className="main-nav">
              {/* <Link to="/">Home</Link>
  <Link to="/movies">Movies</Link>
  <Link to="/tv">TV Shows</Link>
  <Link to="/popular">New &amp; Popular</Link> */}
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
              <iframe
                title={movie.Title}
                src={`https://vidsrc.me/embed/movie?imdb=${imdbId}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                frameBorder="0"
                allowFullScreen
              />
            </div>
          </div>
        </main>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</p>
      )}
    </div>
    
  );
  
}
