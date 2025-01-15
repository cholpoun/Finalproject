import styled from 'styled-components';
import { Calendar, MapPin, Ticket } from "lucide-react";
import PropTypes from 'prop-types';

const StyledCard = styled.div`
  overflow: hidden;
  transition: all 0.3s;
  &:hover {
    box-shadow: var(--box-shadow-xl);
    transform: translateY(-4px);
  }
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
  padding: 1rem;
  border-radius: 8px;
`;

const ImageContainer = styled.div`
  position: relative;
  height: 12rem;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const InfoText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-gray-600);
  margin-bottom: 0.5rem;
`;

const PriceText = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  color: var(--color-festival-purple);
  margin-bottom: 1rem;
`;

const FestivalCard = ({ 
  title, 
  date, 
  location, 
  price, 
  imageUrl, 
  genre, 
  artistLineup, 
  favourite 
}) => {
  return (
    <StyledCard>
      <ImageContainer>
        <Image src={imageUrl} alt={title} />
      </ImageContainer>
      <h2>{title}</h2>
      <InfoText>
        <Calendar className="w-4 h-4" />
        <span>{date}</span>
      </InfoText>
      <InfoText>
        <MapPin className="w-4 h-4" />
        <span>{location}</span>
      </InfoText>
      <PriceText>
        <Ticket className="w-4 h-4" />
        <span>{price}</span>
      </PriceText>
      <InfoText>
        <span>Genre: {genre}</span>
      </InfoText>
      <InfoText>
        <span>Lineup: {artistLineup}</span>
      </InfoText>
      <InfoText>
        <span>Favourite: {favourite ? 'Yes' : 'No'}</span>
      </InfoText>
    </StyledCard>
  );
};

FestivalCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  location: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
  genre: PropTypes.string.isRequired,
  artistLineup: PropTypes.string.isRequired,
  favourite: PropTypes.bool,
};

FestivalCard.defaultProps = {
  favourite: false, // Default value if favourite is not passed
};

export default FestivalCard;
