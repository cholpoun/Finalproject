import PropTypes from 'prop-types';
import styled from 'styled-components';
import FestivalCard from './FestivalCard.jsx';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr); /* 1 card per row on mobile */
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr); /* 3 cards per row on tablet and above */
  }
`;

const FavoriteFestivalsList = ({ favoriteFestivals, onFavoriteToggle }) => {
  if (!Array.isArray(favoriteFestivals) || favoriteFestivals.length === 0) {
    return <p>No favorite festivals available</p>;
  }

  return (
    <GridContainer>
      {favoriteFestivals.map((festival) => {
        const imageUrl = festival.image || 'default-image-url.jpg'; // Use a fallback image if not available
        return (
          <FestivalCard 
            key={festival._id} 
            id={festival._id} 
            name={festival.name} 
            imageUrl={imageUrl}
            isFavoriteInitially={true}  
            onFavoriteToggle={onFavoriteToggle} 
          />
        );
      })}
    </GridContainer>
  );
};

FavoriteFestivalsList.propTypes = {
  favoriteFestivals: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      image: PropTypes.string, // Image is optional
    })
  ).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default FavoriteFestivalsList;
