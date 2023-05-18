interface ISignUpRequest {
  name: string;
  login: string;
  password: string;
}

interface IUserData {
  id: string;
  name: string;
  login: string;
}

interface ISignInRequest {
  login: string;
  password: string;
}

interface ISignInResponse {
  token: string;
}

export type { ISignUpRequest, IUserData, ISignInRequest, ISignInResponse };
