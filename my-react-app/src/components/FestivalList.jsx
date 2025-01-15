import festivals from '/Festivals.js';
import FestivalCard from './FestivalCard';

const FestivalList = () => {
  return (
    <div>
      {festivals.map((festival) => (
        <FestivalCard 
          key={festival.id}
          title={festival.name}
          date={`${festival.date} ${festival.time}`}
          location={festival.location}
          price={festival.price}
          imageUrl={festival.image}
          genre={festival.genre}
          artistLineup={festival.artistLineup}
          favourite={festival.favourite}
        />
      ))}
    </div>
  );
};

export default FestivalList;
