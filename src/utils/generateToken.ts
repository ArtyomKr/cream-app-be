import { sign } from 'jsonwebtoken';

function generateToken(id: string, login: string) {
  // TODO: add expire time
  return sign({ userId: id, userLogin: login }, process.env.JWT_SECRET_KEY as string);
}

export default generateToken;
