import PropTypes from "prop-types";
import styled from "styled-components";
import FestivalCard from "./FestivalCard.jsx";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FestivalsList = ({ festivals }) => {
  if (!Array.isArray(festivals) || festivals.length === 0) {
    return <p>No festivals available</p>;
  }

  return (
    <GridContainer>
      {festivals.map((festival) => {
        const imageUrl = festival.image || "default-image-url.jpg";
        const location = festival.location || "Unknown location";
        const genre = festival.genre || "Unknown genre";

        return (
          <FestivalCard
            key={festival._id}
            id={festival._id}
            name={festival.name}
            imageUrl={imageUrl}
            location={location}
            genre={genre}
          />
        );
      })}
    </GridContainer>
  );
};

FestivalsList.propTypes = {
  festivals: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string,
      location: PropTypes.string,
      genre: PropTypes.string,
    })
  ).isRequired,
};

export default FestivalsList;
