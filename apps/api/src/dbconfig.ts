import pg from 'pg';
import "dotenv/config";

const { Client } = pg;

const dbClient = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  idle_in_transaction_session_timeout: 60000,
});

export default dbClient;