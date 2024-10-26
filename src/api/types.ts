export interface IRegisterData {
  email: string;
  password: string;
}

export interface IRegisterResponse {
  userId: string;
}

export interface ILoginData {
  username: string;
  password: string;
}

export interface ILoginResponse {
  userId: string;
  accessToken: string;
}
