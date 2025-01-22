// Komponent för att visa detaljer om en specifik festival.

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FestivalDetailsPage = () => {
  const { id } = useParams();
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivalDetails = async () => {
      try {
        const response = await axios.get(`https://finalproject-vol6.onrender.com/festivals/${id}`);
        setFestival(response.data);
      } catch (error) {
        console.error('Error fetching festival details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivalDetails();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!festival) {
    return <p>Festival not found!</p>;
  }

  return (
    <div>
      <h1>{festival.name}</h1>
      <p>{festival.description}</p>
      <p>{festival.date}</p>
    </div>
  );
};

export default FestivalDetailsPage;
