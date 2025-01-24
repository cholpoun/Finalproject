import { useEffect, useState } from 'react';
import FestivalCard from './FestivalCard';

const FestivalList = () => {
  const [festivals, setFestivals] = useState([]);

  useEffect(() => {
    const fetchFestivals = async () => {
      try {
        const response = await fetch('https://finalproject-vol6.onrender.com/festivals');
        const data = await response.json();
        setFestivals(data.data); // Sätt festivals till data.data från API-responsen
      } catch (error) {
        console.error('Error fetching festivals:', error);
      }
    };

    fetchFestivals();
  }, []);

  return (
    <div>
      {festivals.map((festival) => (
        <FestivalCard
          key={festival._id}   // Använd festivalens _id som nyckel
          id={festival._id}     // Skicka _id som id till FestivalCard
          name={festival.name}  // Skicka festivalens namn
        />
      ))}
    </div>
  );
};

export default FestivalList;
