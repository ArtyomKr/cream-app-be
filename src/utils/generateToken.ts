import { sign } from 'jsonwebtoken';

function generateToken(id: string, login: string) {
  return sign({ userId: id, login }, process.env.JWT_SECRET_KEY as string);
}

export default generateToken;
