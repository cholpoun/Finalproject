import PropTypes from 'prop-types';

const Filters = ({
  genreFilter,
  setGenreFilter,
  locationFilter,
  setLocationFilter,
  uniqueGenres,
  uniqueLocations,
}) => {
  return (
    <div>
      {/* Genre Filter Dropdown */}
      <select
        value={genreFilter}
        onChange={(e) => setGenreFilter(e.target.value)}
      >
        <option value="">All Genres</option>
        {uniqueGenres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>

      {/* Location Filter Dropdown */}
      <select
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
      >
        <option value="">All Locations</option>
        {uniqueLocations.map((location) => (
          <option key={location} value={location}>
            {location}
          </option>
        ))}
      </select>
    </div>
  );
};


Filters.propTypes = {
  genreFilter: PropTypes.string.isRequired,
  setGenreFilter: PropTypes.func.isRequired,
  locationFilter: PropTypes.string.isRequired,
  setLocationFilter: PropTypes.func.isRequired,
  uniqueGenres: PropTypes.arrayOf(PropTypes.string).isRequired,
  uniqueLocations: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Filters;
