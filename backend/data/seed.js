import mongoose from "mongoose";
import UserModel from "../models/Users.js";
import { hashPassword } from "../utils/hashPassword.js";

// Anslut till databasen
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Databasen ansluten!");
  } catch (error) {
    console.error("Kunde inte ansluta till databasen:", error);
    process.exit(1);
  }
};

// Seed-data för användare
const seedUsers = async () => {
  try {
    // Kryptera lösenord
    const hashedPassword1 = await hashPassword("password123");
    const hashedPassword2 = await hashPassword("securepassword");

    const users = [
      {
        username: "johndoe",
        email: "john.doe@example.com",
        password: hashedPassword1,
        favouriteFestivals: ["64a56b7890abcdef87654321"], // Exempel på ObjectId
        purchasedTickets: [
          {
            festivalId: "64b23a5678abcdef90123456",
            quantity: 2,
            purchaseDate: new Date(),
          },
        ],
      },
      {
        username: "janedoe",
        email: "jane.doe@example.com",
        password: hashedPassword2,
        favouriteFestivals: ["64a56b7890abcdef12345678"], // Exempel på ObjectId
        purchasedTickets: [
          {
            festivalId: "64b23a5678abcdef78901234",
            quantity: 1,
            purchaseDate: new Date(),
          },
        ],
      },
    ];

    // Rensa befintlig data
    await UserModel.deleteMany({});
    console.log("Existerande användardata raderad.");

    // Lägg till seed-data
    await UserModel.insertMany(users);
    console.log("Användare seedade!");
  } catch (error) {
    console.error("Kunde inte seeda användare:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Kör seed-processen
const runSeed = async () => {
  await connectDB();
  await seedUsers();
};

runSeed();
