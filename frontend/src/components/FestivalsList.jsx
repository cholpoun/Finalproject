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

const FestivalsList = ({ festivals, favoriteFestivals, onFavoriteToggle }) => {
  // Kontrollera om festivals finns och är en array
  if (!Array.isArray(festivals) || festivals.length === 0) {
    return <p>No festivals available</p>;
  }

  return (
    <GridContainer>
      {festivals.map((festival) => {
        // Kontrollera att favoriteFestivals är en array och använd .includes() på den
        const isFavorite = Array.isArray(favoriteFestivals) && favoriteFestivals.includes(festival._id);
        
        // Sätt en fallback för festivalbild om den inte finns
        const imageUrl = festival.image || 'default-image-url.jpg'; // Använd en standardbild här om festival.image är null/undefined

        return (
          <FestivalCard 
            key={festival._id} 
            id={festival._id} 
            name={festival.name} 
            imageUrl={imageUrl} // Skicka med den säkerställda bild-URL
            isFavoriteInitially={isFavorite} 
            onFavoriteToggle={onFavoriteToggle} 
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
      image: PropTypes.string, // Bild är valfri, kan vara null/undefined
    })
  ).isRequired,
  favoriteFestivals: PropTypes.arrayOf(PropTypes.string).isRequired,
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default FestivalsList;
