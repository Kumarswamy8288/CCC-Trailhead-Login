export type Env = {
  MOCHA_USERS_SERVICE_API_URL: string;
  MOCHA_USERS_SERVICE_API_KEY: string;
  DB: any; // Replace 'any' with your DB type if known
};

export type Variables = {
  user?: any;
  admin?: { id: number; email: string; isAdmin: boolean };
};
