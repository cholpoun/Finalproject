import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover; /* Bevarar bildens proportioner utan att sträcka ut den */
`;

const CardContent = styled.div`
  padding: 16px;
  text-align: center;
`;

const FavoriteButton = styled.span`
  cursor: pointer;
  font-size: 24px;
`;

const FestivalCard = ({ id, name, imageUrl, isFavoriteInitially, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);

  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    onFavoriteToggle(id, newFavoriteStatus); // Uppdatera favoritstatus i föräldern
  };

  useEffect(() => {
    setIsFavorite(isFavoriteInitially); // Uppdatera om initial status ändras
  }, [isFavoriteInitially]);

  return (
    <Card>
      <CardImage src={imageUrl} alt={name} />
      <CardContent>
        <h2>{name}</h2>
        <FavoriteButton onClick={toggleFavorite}>
          {isFavorite ? '❤️' : '🤍'}
        </FavoriteButton>
      </CardContent>
    </Card>
  );
};

FestivalCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  isFavoriteInitially: PropTypes.bool.isRequired, 
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default FestivalCard;
