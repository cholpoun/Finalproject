import { useEffect } from "react";
import FestivalsList from "./FestivalsList.jsx";

const FestivalsApp = () => {
  

  useEffect(() => {
    // Hämta data från API
    fetch("https://finalproject-vol6.onrender.com/festivals")
      .then((response) => response.json())
  }, []);



  return (
    <div>
     
      <FestivalsList />
    </div>
  );
};

export default FestivalsApp;
