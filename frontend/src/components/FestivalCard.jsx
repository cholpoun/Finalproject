import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; // Import Link component

const CardContainer = styled.div`
  text-align: center;
`;

const FestivalCard = ({ id, name, imageUrl }) => {
  return (
    <Link to={`/festivals/${id}`}>  {/* Wrap the entire card in a Link */}
      <CardContainer key={id} data-id={id}>
        <h3>{name}</h3>
        <img src={imageUrl} alt={name} style={{ width: '100%', height: 'auto' }} />
      </CardContainer>
    </Link>
  );
};

FestivalCard.propTypes = {
  id: PropTypes.string.isRequired, 
  name: PropTypes.string.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default FestivalCard;
