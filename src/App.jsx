// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import MangaItem from "./components/mangaItem";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [searchedMangas, setSearchedMangas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isMangaLodaing, setIsMangaLodaing] = useState(false);
  const [chapterLoadingError, setChapterLoadingError] = useState(null);
  const [openedManga, setOpenedManga] = useState(null);
  const [chapterOpened, setChapterOpened] = useState(null);
  const [isChapterBeingLoaded, setIsChapterBeingLoaded] = useState(false);

  async function getManga(mangaName) {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/manga/search/${mangaName}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setSearchedMangas(data.results);
      setLoading(false); // Set loading state to false after fetching data

      setError(null);
    } catch (error) {
      console.error("Error fetching manga info:", error);
      setError(error.message);
      setLoading(false); // Set the error state
    }
  }

  async function openManga(mangaId) {
    try {
      setIsMangaLodaing(true);
      const response = await fetch(`http://localhost:5000/manga/${mangaId}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setOpenedManga(data);
      setIsMangaLodaing(false);

      setError(null); // Clear previous errors if any
    } catch (error) {
      console.error("Error fetching manga info:", error);
      setIsMangaLodaing(false);
      setChapterOpened(true);
      setError(error.message); // Set the error state
    }
    // Fetch manga details and populate the manga page with details
  }

  async function getChapterPages(chapterId) {
    try {
      setChapterOpened(chapterId);
      setIsChapterBeingLoaded(true);
      const response = await fetch(
        `http://localhost:5000/chapter/getPages/${chapterId}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setChapterOpened(data);
      setIsChapterBeingLoaded(false);

      setChapterLoadingError(null); // Clear previous errors if any
    } catch (error) {
      console.error("Error fetching manga info:", error);
      setIsChapterBeingLoaded(false);
      setChapterLoadingError(error.message); // Set the error state
    }
    // Fetch manga details and populate the manga page with details
  }

  return (
    <>
      <div className="main-page">
        {isMangaLodaing ? (
          <div className="loading-screen"></div>
        ) : openedManga !== null ? (
          chapterOpened !== null ? (
            isChapterBeingLoaded ? (
              <div className="loading-screen"></div>
            ) : (
              <div className="chapter-page">
                <div className="back-to-manga-page-btn">
                  <span
                    className="material-symbols-outlined manga-back-btn"
                    onClick={() => setChapterOpened(null)}
                  >
                    arrow_back_ios
                  </span>
                </div>

                <div className="chapter-pages">
                  {
                    chapterLoadingError !== null ? (
                      <div className="chapter-error-message">{chapterLoadingError}</div>
                    ) : (
                      chapterOpened.map((page, index) => (
                        <img key={index} src={page.img} alt={`Page ${index + 1}`} />
                      ))
                    )
                  }
                </div>
              </div>
            )
          ) : (
            <div className="manga-page">
              <div className="back-to-main-page-btn">
                <span
                  className="material-symbols-outlined back-btn"
                  onClick={() => setOpenedManga(null)}
                >
                  arrow_back_ios
                </span>
              </div>

              <div className="manga-page-info">
                <div className="manga-page-cover">
                  <img src={openedManga.image} />
                </div>
                <div className="manga-page-info-card">
                  <div className="manga-page-info-card-title">
                    {openedManga.title}
                  </div>
                  <div className="manga-page-info-description">
                    <span style={{ color: "white", fontSize: "17px" }}>
                      Description :{" "}
                    </span>
                    {openedManga.description}
                  </div>

                  <div className="manga-page-genres">
                    <div className="genres">
                      {openedManga.genres && openedManga.genres.length > 0
                        ? openedManga.genres.map((genre, index) => (
                            <span className="genre" key={index}>
                              {genre}
                            </span>
                          ))
                        : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="manga-chapters-section">
                <h3>Chapters</h3>
                <hr></hr>
                <div className="manga-chapters">
                  {openedManga.chapters && openedManga.chapters.length > 0
                    ? openedManga.chapters.map((chapter, index) => (
                        <div key={index} className="manga-chapter">
                          {
                            <>
                              <div
                                className="manga-titlle"
                                onClick={() => {
                                  getChapterPages(chapter.id);
                                }}
                              >
                                {chapter.id.split("-").join(" ")}
                              </div>
                              <div className="manga-chapter-release-date">
                                {chapter.releaseDate.split(" ").slice(0, 1)}
                              </div>
                            </>
                          }
                        </div>
                      ))
                    : null}
                </div>
              </div>
            </div>
          )
        ) : (
          <>
            <div className="website-welcome-msg">
              Welcome to <span style={{ color: "#FECD55" }}>Manga Read</span>.
            </div>

            <div className="search-bar">
              <input
                value={searchQuery}
                className="search-query"
                type="text"
                placeholder="Search Manga..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="search-btn"
                type="button"
                onClick={() => {
                  if (searchQuery.length > 0) {
                    getManga(searchQuery);
                  }
                }}
              >
                Search
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="loading-screen"></div>
            ) : (
              <div className="mangas">
                {searchedMangas.map((mangaItem, index) => {
                  return (
                    <MangaItem
                      key={index}
                      cover={mangaItem.image}
                      mangaRating={mangaItem.contentRating}
                      mangaReleaseDate={
                        mangaItem.releaseDate === null
                          ? ""
                          : mangaItem.releaseDate
                      }
                      mangaStatus={mangaItem.status}
                      mangaTitle={mangaItem.title}
                      onClickFn={() => openManga(mangaItem.id)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default App;
