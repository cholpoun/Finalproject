export const sampleUsers = [
  {
    username: "johndoe",
    email: "john.doe@example.com",
    password: "password123",
    favouriteFestivals: ["64a56b7890abcdef87654321"],
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
    password: "securepassword",
    favouriteFestivals: ["64a56b7890abcdef12345678"],
    purchasedTickets: [
      {
        festivalId: "64b23a5678abcdef78901234",
        quantity: 1,
        purchaseDate: new Date(),
      },
    ],
  },
];
