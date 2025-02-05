import PropTypes from "prop-types";
import { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e07ba1 0%, #176b91 100%);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease-in-out;
  height: 90%;
  margin: auto;
  &:hover {
    transform: scale(1.02);
  }
`;

const CardImageContainer = styled.div`
  width: 100%;
  height: 220px;
  overflow: hidden;
  border-radius: 8px;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  width: 100%;
  height: 75%;
`;

const FestivalDetails = styled.p`
  font-size: 0.9rem;
  color: #f4f4f4;
  margin: 0 auto;
`;

const FestivalLink = styled(Link)`
  text-decoration: none;
  display: inline-block;

  h2 {
    color: #f4f4f4;
    transition: color 0.3s ease, text-decoration 0.3s ease;
    font-size: 20px;
    margin: 16px auto;
  }

  &:hover h2 {
    color: #eeffaf;
    text-decoration: underline;
  }
`;

const GenreLink = styled(Link)`
  font-size: 0.9rem;
  color: #eeffaf;
  text-decoration: none;
  margin-top: 8px;
`;

const FavoriteButtonWrapper = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  padding-bottom: 8px;
`;

const FestivalCard = ({ id, name, imageUrl, location, genre }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite((prevState) => !prevState);
  };

  return (
    <Card>
      <CardImageContainer>
        <CardImage src={imageUrl} alt={name} />
      </CardImageContainer>
      <CardContent>
        <FestivalLink to={`/festivals/${id}`}>
          <h2>{name}</h2>
        </FestivalLink>
        <FestivalDetails>{location}</FestivalDetails>
        <GenreLink to={`/festivals?genre=${encodeURIComponent(genre)}`}>
          #{genre}
        </GenreLink>
        <FavoriteButtonWrapper>
          <FavoriteButton
            festivalId={id}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </FavoriteButtonWrapper>
      </CardContent>
    </Card>
  );
};

FestivalCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired,
};

export default FestivalCard;
