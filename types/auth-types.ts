export type User = {
  name: string;
  email: string;
};

export type UserMeResponse = GenericResponse & {
  data: { name: string; email: string };
};

export type UserLoginResponse = GenericResponse & {
  data: { token: string };
};

export type UserRegisterResponse = GenericResponse & {
  data: UserMeResponse;
};

export type GenericResponse = {
  status: string;
  statusCode: number;
  message: string;
};
