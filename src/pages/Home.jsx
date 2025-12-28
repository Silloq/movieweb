// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { posterURL, makeDebounce, searchOMDb } from "../utils/myjs";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [homeMovies, setHomeMovies] = useState([]);
  const [hero, setHero] = useState(null);
  const navigate = useNavigate();

  // Load homepage movies once
  useEffect(() => {
    (async () => {
      const r = await fetch("/api/home");
      const j = await r.json();
      setHomeMovies(j);
      if (j.length) {
        const random = j[Math.floor(Math.random() * j.length)];
        setHero(random);
      }
    })();
  }, []);

  const debounced = useMemo(() => makeDebounce(), []);

  // Search mode
  useEffect(() => {
    if (!searchQuery) {
      setResults([]);
      return;
    }
    debounced(searchQuery, async (q) => {
      const movies = await searchOMDb(q);
      setResults(movies);
    });
  }, [searchQuery, debounced]);

  const handleWatch = (imdbId) => {
    navigate(`/watch/${imdbId}`);
  };

  const visible = searchQuery ? results : homeMovies;

  return (
    <div className="app">
      {/* Header */}
      <header className="site-header">
        <div className="container header-inner">
          <div className="brand-and-nav">
            <h1 className="brand">CineStream</h1>
            <nav className="main-nav">
              <a href="#">Home</a>
              <a href="#">Movies</a>
              <a href="#">TV Shows</a>
              <a href="#">New &amp; Popular</a>
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

      {/* Hero */}
      <section className="hero">
        <div className="hero-tint" />
        <img
          className="hero-image"
          alt={hero?.Title || "Featured"}
          src={posterURL(hero?.Poster || "")}
        />
        <div className="container hero-content">
          <h2 className="hero-title">{hero?.Title || "Loading..."}</h2>
          <p className="hero-subtitle">{hero?.Plot || ""}</p>
          <div className="hero-actions">
            {hero?.imdbID && (
              <button
                className="btn btn-gradient btn-lg"
                onClick={() => handleWatch(hero.imdbID)}
              >
                Play Now
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grid */}
      <main className="container main">
        <section className="section">
          <div className="section-head">
            <h3 className="section-title">
              {searchQuery ? `Results for “${searchQuery}”` : "Featured Movies"}
            </h3>
          </div>

          <div className="card-grid card-grid--tight">
            {visible.slice(0, 25).map((m) => (
              <div key={m.imdbID} className="card group">
                <div className="poster-wrap">
                  <img alt={m.Title} className="poster" src={posterURL(m.Poster)} />
                  <div className="poster-overlay">
                    <button
                      className="btn btn-solid w-full"
                      onClick={() => handleWatch(m.imdbID)}
                    >
                      Watch Now
                    </button>
                  </div>
                </div>
                <h4 className="card-title">{m.Title}</h4>
                <p className="card-meta">{m.Year}</p>
              </div>
            ))}
          </div>
        </section>



        
      </main>
       <footer className="site-footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h4 className="brand brand--sm">CineStream</h4>
              <p className="muted">The ultimate streaming experience with thousands of movies and TV shows.</p>
            </div>
        
            <div>
              <h5 className="footer-head">Support</h5>
              <ul className="link-list">
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Devices</a></li>
              </ul>
            </div>
            <div>
              <h5 className="footer-head">Legal</h5>
              <ul className="link-list">
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">© 2024 CineStream. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}
