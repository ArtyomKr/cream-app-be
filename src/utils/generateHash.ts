import { genSalt, hash } from 'bcrypt';

const saltSize = +(process.env.SALT_SIZE ?? '10');

async function generateHash(str: string) {
  const salt = await genSalt(saltSize);
  return hash(str, salt);
}

export default generateHash;
