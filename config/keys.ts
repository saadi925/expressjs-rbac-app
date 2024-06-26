import path from 'path';

export const KEYS = {
  JWT_SECRET: process.env.JWT_SECRET || 'fA*&%23sha#@#',
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
  server: process.env.SERVER || 'https://www.codingstack.site',
  email: process.env.G_EMAIL,
  password: process.env.G_PASSWORD,
};

export const rbacConfig = {
  model: path.resolve(__dirname, './rbac_model.conf'),
  policy: path.resolve(__dirname, './rbac_policy.csv'),
};
