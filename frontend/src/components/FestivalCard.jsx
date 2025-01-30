import PropTypes from "prop-types";
import styled from "styled-components";
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

const FestivalDetails = styled.p`
  font-size: 0.9rem;
  color: #f4f4f4;
  margin: 4px 0;
`;

const FestivalLink = styled(Link)`
  text-decoration: none;
  display: inline-block;

  h2 {
    color: #f4f4f4;
    transition: color 0.3s ease, text-decoration 0.3s ease;
  }

  &:hover h2 {
    color: #eeffaf;
    text-decoration: underline;
  }
`;

const FestivalCard = ({ id, name, imageUrl, location, genre }) => {
  return (
    <Card>
      <CardImage src={imageUrl} alt={name} />
      <CardContent>
        <FestivalLink to={`/festivals/${id}`}>
          <h2>{name}</h2>
        </FestivalLink>
        <FestivalDetails>{location}</FestivalDetails>
        <Link
          to={`/festivals?genre=${encodeURIComponent(genre)}`}
          style={{ color: "#eeffaf", textDecoration: "none" }}
        >
          #{genre}
        </Link>
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
