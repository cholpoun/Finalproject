import bcrypt from "bcrypt";

/**
 * Hashar ett lösenord med Bcrypt.
 * @param {string} password - Lösenordet som ska krypteras.
 * @returns {Promise<string>} - Det krypterade lösenordet.
 */
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Jämför ett lösenord med ett krypterat lösenord.
 * @param {string} password - Användarens lösenord.
 * @param {string} hashedPassword - Det krypterade lösenordet.
 * @returns {Promise<boolean>} - Om lösenorden matchar.
 */
export const comparePasswords = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
