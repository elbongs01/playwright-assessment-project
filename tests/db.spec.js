import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function runDBTests() {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  });

  await client.connect();

  // 1. Insert a task
  const insertResult = await client.query(
    "INSERT INTO tasks (title, completed, user_id) VALUES ('Engineer', 'Yes', 'ENG01') RETURNING *"
  );
  console.log("Inserted:", insertResult.rows[0]);

  // 2. Verify task exists
  const selectResult = await client.query("SELECT * FROM tasks WHERE title = 'Engineer'");
  console.log("Selected:", selectResult.rows[0]);

  // 3. Update task
  const updateResult = await client.query(
    "UPDATE tasks SET completed = true WHERE title = 'Engineer' RETURNING *"
  );
  console.log("Updated:", updateResult.rows[0]);

  await client.end();
}

runDBTests();
