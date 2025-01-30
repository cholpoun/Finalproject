import PropTypes from 'prop-types';
import styled from 'styled-components';
import { ChevronDown } from 'lucide-react';

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 200px; /* Justera bredden efter behov */
`;

const Select = styled.select`
  appearance: none;
  width: 100%;
  background-color: white;
  border: 2px solid black;
  border-radius: 8px;
  padding: 10px 40px 10px 10px; /* Extra padding till höger för att ge plats åt ikonen */
  font-size: 16px;
  cursor: pointer;
  outline: none;
  color: black;
  transition: all 0.3s ease;

  &:hover {
    border-color: #333;
  }

  &:focus {
    border-color: #222;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  pointer-events: none; /* Ser till att ikonen inte blockerar klick */
`;

const StyledFiltersWrapper = styled.div`
  display: flex;
  gap: 16px;  /* Justera gapet mellan filtren */
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  margin: 16px 0;
`;

const Filters = ({
  genreFilter,
  setGenreFilter,
  locationFilter,
  setLocationFilter,
  uniqueGenres,
  uniqueLocations,
}) => {
  return (
    <StyledFiltersWrapper>
      <SelectWrapper>
        <Select value={genreFilter} onChange={(e) => setGenreFilter(e.target.value)}>
          <option value="">All Genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </Select>
        <IconWrapper>
          <ChevronDown size={20} color="black" />
        </IconWrapper>
      </SelectWrapper>

      <SelectWrapper>
        <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
          <option value="">All Locations</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </Select>
        <IconWrapper>
          <ChevronDown size={20} color="black" />
        </IconWrapper>
      </SelectWrapper>
    </StyledFiltersWrapper>
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
