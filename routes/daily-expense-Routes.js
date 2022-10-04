const assert = require("assert");
const myWaiter = require("../daily-expense");
const pgp = require("pg-promise")();

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres:pg123@localhost:5432/daily_expense_tests";

const config = {
  connectionString: DATABASE_URL,
};

const db = pgp(config);