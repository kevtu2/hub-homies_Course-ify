import * as dotenv from "dotenv";
dotenv.config();

const config = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    JWT_SECRET: process.env.JWT_SECRET
}

export default config