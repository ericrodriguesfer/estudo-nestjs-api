declare namespace Express {
  export interface Request {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
    };
  }
}
