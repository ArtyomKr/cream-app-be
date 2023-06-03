import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import errorConstructor from '../utils/errorConstructor';
import IJwtPayload from '../models/jwtPayloadModel';

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    const status = 401;
    res.status(status).json(errorConstructor({ status, message: 'Auth token is missing' }));
    return;
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET_KEY as string) as IJwtPayload;
    res.locals.userId = decoded.userId;
    res.locals.userLogin = decoded.userLogin;

    next();
  } catch (err) {
    const status = 401;
    res.status(status).json(errorConstructor({ status, message: 'Invalid token' }));
  }
};

export default auth;
