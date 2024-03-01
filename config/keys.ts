import path from 'path';

export const KEYS = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/advoco',
  JWT_SECRET: process.env.JWT_SECRET || 'fA*&%23sha#@#',

  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 3000,
  server: process.env.SERVER || 'http://localhost:3000',
  email: process.env.G_EMAIL || '',
  password: process.env.G_PASSWORD,
};

export const rbacConfig = {
  model: path.resolve(__dirname, './rbac_model.conf'),
  policy: path.resolve(__dirname, './rbac_policy.csv'),
};
