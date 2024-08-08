import PropTypes from "prop-types"

const mangaItem = ({cover, mangaTitle, mangaReleaseDate, mangaRating, mangaStatus, onClickFn}) => {
  return (
    <>
        <div className="manga-item" onClick={
          onClickFn
        }>
            <div className="manga-cover">
              <img src={cover} alt="Manga Cover" />
            </div>
            <div className="manga-info">
              <div className="manga-title-status">
                <div className="manga-title">{mangaTitle}</div>
                <div className="manga-date">{mangaReleaseDate}</div>
              </div>
              <div className="manga-description">
                <div className="rating">{mangaRating}</div>
                <div className="status">{mangaStatus}</div>
              </div>
            </div>
          </div>
    </>
  )
}

mangaItem.propTypes = { 
    cover: PropTypes.string.isRequired,
    mangaTitle: PropTypes.string.isRequired,
    mangaReleaseDate: PropTypes.any,
    mangaRating: PropTypes.string,
    mangaStatus: PropTypes.string,
    onClickFn: PropTypes.func.isRequired
}

export default mangaItem