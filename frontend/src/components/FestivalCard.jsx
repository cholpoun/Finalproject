import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from "react-router-dom";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e07ba1 0%, #176b91 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  padding: 16px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
`;

const CardContent = styled.div`
  padding: 16px;
  text-align: center;
  font-family: "Quicksand", sans-serif;
  color: #f4f4f4;
`;

const FavoriteButton = styled.span`
  cursor: pointer;
  font-size: 24px;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: scale(1.2);
  }
`;

const FestivalCard = ({ id, name, imageUrl, isFavoriteInitially, onFavoriteToggle }) => {
  const [isFavorite, setIsFavorite] = useState(isFavoriteInitially);

  const toggleFavorite = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    onFavoriteToggle(id, newFavoriteStatus);
  };

  useEffect(() => {
    setIsFavorite(isFavoriteInitially);
  }, [isFavoriteInitially]);

  return (
    <Card>
      <CardImage src={imageUrl} alt={name} />
      <CardContent>
        <Link to={`/festivals/${id}`} style={{ textDecoration: 'none', color: '#f4f4f4' }}>
          <h2>{name}</h2>
        </Link>
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
  location: PropTypes.string,
  date: PropTypes.string,
  isFavoriteInitially: PropTypes.bool.isRequired, 
  onFavoriteToggle: PropTypes.func.isRequired,
};

export default FestivalCard;
