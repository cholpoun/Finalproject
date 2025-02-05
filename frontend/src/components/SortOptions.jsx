import PropTypes from "prop-types";
import styled from "styled-components";
import { ChevronDown } from "lucide-react";

const SelectWrapper = styled.div`
  position: relative;
  display: inline-block;
  width: 200px;
`;

const Select = styled.select`
  appearance: none;
  width: 100%;
  background-color: white;
  border: 2px solid black;
  border-radius: 8px;
  padding: 10px 40px 10px 10px;
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
  pointer-events: none;
`;

const SortOptions = ({ sortOption, setSortOption }) => {
  return (
    <SelectWrapper>
      <Select
        value={sortOption}
        onChange={(e) => setSortOption(e.target.value)}
        aria-label="Sort by"
      >
        <option value="">Sort By</option>
        <option value="name-asc">Name (A-Ö)</option>
        <option value="name-desc">Name (Ö-A)</option>
        <option value="genre-asc">Genre (A-Ö)</option>
        <option value="genre-desc">Genre (Ö-A)</option>
      </Select>
      <IconWrapper aria-hidden="true">
        <ChevronDown size={20} color="black" />
      </IconWrapper>
    </SelectWrapper>
  );
};

SortOptions.propTypes = {
  sortOption: PropTypes.string.isRequired,
  setSortOption: PropTypes.func.isRequired,
};

export default SortOptions;
