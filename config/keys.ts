import path from "path"


export const KEYS = {
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/advoco",
  JWT_SECRET: process.env.JWT_SECRET || "fA*&%23sha#@#",
}

export const rbacConfig = {
  model : path.resolve(__dirname,"./rbac_model.conf"),
  policy : path.resolve(__dirname,"./rbac_policy.csv")
}