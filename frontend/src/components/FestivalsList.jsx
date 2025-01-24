import PropTypes from 'prop-types';
import styled from 'styled-components';
import FestivalCard from './FestivalCard.jsx';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr); 
  gap: 16px;
  padding: 16px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const FestivalsList = ({ festivals }) => {
  if (!festivals || festivals.length === 0) {
    return <p>No festivals available</p>;
  }

  return (
    <GridContainer>
      {festivals.map((festival) => (
        <FestivalCard key={festival._id} id={festival._id} name={festival.name} />
      ))}
    </GridContainer>
  );
};

FestivalsList.propTypes = {
  festivals: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FestivalsList;
