import { useEffect, useState } from 'react';
import axios from 'axios';

const FestivalsPage = () => {
  const [festival, setFestival] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFestivalData = async () => {
      try {
        const response = await axios.get(`https://finalproject-vol6.onrender.com/festivals`);
        setFestival(response.data); 
      } catch (err) {
        setError(err); 
      } finally {
        setIsLoading(false); 
      }
    };

    fetchFestivalData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!festival) {
    return <div>No festival data found.</div>; 
  }

  return (
    <div>
      <h1>{festival.name}</h1>
      <p>{festival.description}</p>
      {/* Assuming festival has an array of 'events' */}
      {festival.events && festival.events.length > 0 && (
        <ul>
          <h2>Upcoming Events:</h2>
          {festival.events.map((event, index) => (
            <li key={index}>
              <h3>{event.title}</h3>
              <p>{event.date}</p> 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FestivalsPage;