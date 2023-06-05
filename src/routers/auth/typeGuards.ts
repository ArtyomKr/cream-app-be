import { ISignInRequest, ISignUpRequest } from '../../models/apiModels';

const isSignupBody = (body: object): body is ISignUpRequest => {
  return (
    'name' in body &&
    'login' in body &&
    'password' in body &&
    typeof body.name === 'string' &&
    typeof body.login === 'string' &&
    typeof body.password === 'string'
  );
};

const isSigninBody = (body: object): body is ISignInRequest => {
  return 'login' in body && 'password' in body && typeof body.login === 'string' && typeof body.password === 'string';
};

export { isSignupBody, isSigninBody };
