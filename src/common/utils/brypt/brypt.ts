import * as bcrypt from 'bcrypt';
const saltRounds = 10;
export async function hashText(plaintext) {
  try {
    const hash = await bcrypt.hash(plaintext, saltRounds);
    return hash;
  } catch (error) {
    throw error;
  }
}
export async function compareText(plaintext, hashText) {
  try {
    return await bcrypt.compare(plaintext, hashText);
  } catch (error) {
    throw error;
  }
}
