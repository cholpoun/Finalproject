import PropTypes from 'prop-types';

const Filters = ({ search, setSearch, location, setLocation, genre, setGenre, sortOption, setSortOption }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search festivals"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="All">All Locations</option>
        <option value="Tromsø, Norge">Tromsø, Norge</option>
        <option value="Köpenhamn, Danmark">Köpenhamn, Danmark</option>
        <option value="Stockholm, Sverige">Stockholm, Sverige</option>
      </select>
      <select value={genre} onChange={(e) => setGenre(e.target.value)}>
        <option value="All">All Genres</option>
        <option value="Electronic">Electronic</option>
        <option value="Jazz">Jazz</option>
        <option value="Indie">Indie</option>
      </select>
      <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
        <option value="date">Sort by Date</option>
        <option value="name">Sort by Name</option>
      </select>
    </div>
  );
};

Filters.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  location: PropTypes.string.isRequired,
  setLocation: PropTypes.func.isRequired,
  genre: PropTypes.string.isRequired,
  setGenre: PropTypes.func.isRequired,
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default Filters;
