import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FestivalDetails = () => {
  const { id } = useParams(); 
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    if (!id) return; 
    const fetchFestival = async () => {
      try {
        const response = await fetch(`http://localhost:3000/festivals/${id}`);
        const data = await response.json();
        setFestival(data);  
      } catch (error) {
        console.error('Error fetching festival details:', error);
      }
    };

    fetchFestival();
  }, [id]);

  return (
    <div>
      {festival ? (
        <div>
          <h1>{festival.name}</h1>
          <p>{festival.location}</p>
          <p>{festival.date}</p>
          <p>{festival.genre}</p>
          <p>Price: {festival.ticketPrice}</p>
        </div>
      ) : (
        <p>Loading festival details...</p>
      )}
    </div>
  );
};

export default FestivalDetails;
