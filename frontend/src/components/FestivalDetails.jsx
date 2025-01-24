import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const FestivalDetails = () => {
  const { id } = useParams(); // Hämtar id från URL
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    if (!id) return; // Om id saknas, gör inget anrop
    const fetchFestival = async () => {
      try {
        const response = await fetch(`https://finalproject-vol6.onrender.com/festivals/${id}`);
        const data = await response.json();
        setFestival(data);  // Sätt festivaldata när den har hämtats
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
