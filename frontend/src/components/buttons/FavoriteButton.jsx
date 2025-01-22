// Komponent för att markera en festival som favorit.
import PropTypes from 'prop-types';
import axios from 'axios';

const FavoriteButton = ({ festivalId, userId, isFavorite, onToggleFavorite }) => {
  const handleFavoriteClick = async () => {
    try {
      const response = await axios.post(`https://finalproject-vol6.onrender.com/users/favourites/${festivalId}`, { userId });
      console.log(response.data);
      onToggleFavorite(!isFavorite); 
    } catch (error) {
      console.error('Error marking as favorite:', error);
    }
  };

  return (
    <button onClick={handleFavoriteClick}>
      {isFavorite ? 'Unmark as Favorite' : 'Mark as Favorite'}
    </button>
  );
};

FavoriteButton.propTypes = {
  festivalId: PropTypes.string.isRequired,  
  userId: PropTypes.string.isRequired,     
  isFavorite: PropTypes.bool.isRequired,
  onToggleFavorite: PropTypes.func.isRequired
};

export default FavoriteButton;
