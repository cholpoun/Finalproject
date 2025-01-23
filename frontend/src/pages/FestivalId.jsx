import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FestivalId = () => {
  const { id } = useParams(); 
  const [festival, setFestival] = useState(null);

  useEffect(() => {
    const fetchFestivalData = async () => {
      try {
        const response = await axios.get(`https://finalproject-vol6.onrender.com/festivals/${id}`);
        setFestival(response.data);  
      } catch (error) {
        console.error('Error fetching festival data:', error);
      }
    };

    fetchFestivalData();
  }, [id]);

  if (!festival) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{festival.name}</h1>
      <p>{festival.description}</p>
    </div>
  );
};

export default FestivalId;
