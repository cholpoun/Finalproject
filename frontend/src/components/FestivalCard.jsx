import PropTypes from 'prop-types';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color:rgb(222, 143, 143);
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
  }
`;

const FestivalCard = ({ name }) => (
  <CardContainer>
    <h3>{name}</h3>
  </CardContainer>
);

FestivalCard.propTypes = {
  name: PropTypes.string.isRequired,
};

export default FestivalCard;
