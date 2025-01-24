import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const CardContainer = styled.div`
  background-color: rgb(220, 90, 90); /* Ljusare bakgrundsfärg */
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }

  h3 {
    font-size: 1.25rem;
    margin: 0;
    color: white; /* Anpassad textfärg för läsbarhet */
  }

  a {
    text-decoration: none;
    color: inherit; /* Ärver textfärg från h3 */
  }
`;

const FestivalCard = ({ id, name }) => {
  if (!id) return null;

  return (
    <CardContainer>
      <h3>
        <Link to={`/festivals/${id}`}>{name}</Link>
      </h3>
    </CardContainer>
  );
};

FestivalCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default FestivalCard;
