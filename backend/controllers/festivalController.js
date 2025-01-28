import FestivalModel from "../models/Festivals.js";
import Image from "../models/Image.js";

export const getFestivalWithImage = async (festivalName) => {
  try {
    // Hämta festivalen baserat på namn
    const festival = await FestivalModel.findOne({
      name: festivalName,
    });

    if (festival) {
      // Hämta alla bilder från databasen
      const images = await Image.find();

      // Här kopplar vi en bild till festivalen, t.ex. genom att välja en random bild
      if (images.length > 0) {
        const randomImage = images[Math.floor(Math.random() * images.length)];

        // Lägg till den valda bildens URL till festivalens bildfält
        festival.image = randomImage.url;
      }

      console.log("Festival:", festival);
      console.log("Festival Image URL:", festival.image);

      return festival; // Skicka tillbaka festivalen med den kopplade bilden
    } else {
      console.log(`Festival with name ${festivalName} not found.`);
      return null;
    }
  } catch (error) {
    console.error("Error fetching festival:", error);
    return null;
  }
};
