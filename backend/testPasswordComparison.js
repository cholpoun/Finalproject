import bcrypt from "bcryptjs";

const enteredPassword = "petra1"; // Det inmatade lösenordet
const storedHashedPassword =
  "$2a$10$A36Ds1qEtBm/XNtqJQgtBub0OIYCD2xuWMkF3Osdp1cQgBe3s5cvC"; // Det lagrade hashade lösenordet

async function testPassword() {
  try {
    const isMatch = await bcrypt.compare(enteredPassword, storedHashedPassword);
    console.log("Password match:", isMatch); // Detta bör returnera true om lösenordet matchar
  } catch (error) {
    console.error("Error comparing passwords:", error);
  }
}

testPassword();
