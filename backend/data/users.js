import bcrypt from "bcrypt";

const hashedPassword1 = await bcrypt.hash("password123", 10);
const hashedPassword2 = await bcrypt.hash("securepassword", 10);

export const users = [
  {
    username: "johndoe",
    email: "john.doe@example.com",
    password: hashedPassword1, // Krypterat lösenord
    favouriteFestivals: ["64a56b7890abcdef87654321"], // Exempel-ObjectId för festival
    purchasedTickets: ["64b23a5678abcdef90123456"], // Exempel-ObjectId för ticket
  },
  {
    username: "janedoe",
    email: "jane.doe@example.com",
    password: hashedPassword2, // Krypterat lösenord
    favouriteFestivals: ["64a56b7890abcdef12345678"], // Exempel-ObjectId för festival
    purchasedTickets: ["64b23a5678abcdef78901234"], // Exempel-ObjectId för ticket
  },
];
