import path from 'path';

export const KEYS = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/advoco',
  JWT_SECRET: process.env.JWT_SECRET || 'fA*&%23sha#@#',

  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 80,
  server: process.env.SERVER || 'https://www.codingstack.site',
  email: process.env.G_EMAIL || 'userid925925@gmail.com',
  password: process.env.G_PASSWORD || 'kxyd aijd mmhi zjoi',
  NGROK_AUTHTOKEN:
    process.env.NGROK_AUTHTOKEN ||
    '2YES5ga1rE7V5tcGmtug2wWrqx3_esRRMUdknfRFpJFEL6ye',
};

export const rbacConfig = {
  model: path.resolve(__dirname, './rbac_model.conf'),
  policy: path.resolve(__dirname, './rbac_policy.csv'),
};
