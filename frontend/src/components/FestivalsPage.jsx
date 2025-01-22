// Komponent för att visa alla festivaler.

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FestivalsPage = () => {
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await axios.get('https://finalproject-vol6.onrender.com/festivals');
        setFestivals(response.data);
      } catch (error) {
        console.error('Error fetching festivals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFestivals();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Festivals</h1>
      <ul>
        {festivals.map((festival) => (
          <li key={festival.id}>
            <Link to={`/festivals/${festival.id}`}>{festival.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FestivalsPage;
