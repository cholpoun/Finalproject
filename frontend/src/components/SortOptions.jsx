import PropTypes from 'prop-types';


const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <div>
      <select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
      >
        <option value="">Sort By</option>
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
};

SortOptions.propTypes = {
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default SortOptions;
