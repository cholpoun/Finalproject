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
  width: 90%;
  margin: auto;
  &:hover {
    transform: scale(1.02);
  }
`;

const CardImageContainer = styled.div`
  width: 100%;
  height: 280px;
  overflow: hidden;
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
        <CardImage
          src={imageUrl}
          alt={`Image of the festival: ${name}`}
          aria-labelledby="festival-name"
        />
      </CardImageContainer>
      <CardContent>
        <FestivalLink
          to={`/festivals/${id}`}
          aria-label={`Go to details of ${name}`}
        >
          <h2 id="festival-name">{name}</h2>
        </FestivalLink>
        <FestivalDetails>{location}</FestivalDetails>
        <GenreLink
          to={`/festivals?genre=${encodeURIComponent(genre)}`}
          aria-label={`See other ${genre} festivals`}
        >
          #{genre}
        </GenreLink>
        <FavoriteButtonWrapper>
          <FavoriteButton
            festivalId={id}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
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
