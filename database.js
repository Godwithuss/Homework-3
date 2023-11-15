const { Pool } = require("pg");
const pool = new Pool({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "homework",
});

// CREATE TABLE customers(
//    customer_id INT GENERATED ALWAYS AS IDENTITY,
//    customer_name VARCHAR(255) NOT NULL,
//    PRIMARY KEY(customer_id)
// );

// CREATE TABLE contacts(
//    contact_id INT GENERATED ALWAYS AS IDENTITY,
//    customer_id INT,
//    contact_name VARCHAR(255) NOT NULL,
//    phone VARCHAR(15),
//    email VARCHAR(100),
//    PRIMARY KEY(contact_id),
//    CONSTRAINT fk_customer
//       FOREIGN KEY(customer_id)
// 	  REFERENCES customers(customer_id)
// 	  ON DELETE SET NULL
// );

const userTable = `CREATE TABLE users(
 user_id BIGSERIAL PRIMARY KEY NOT NULL,
 username VARCHAR(200) NOT NULL,
 role VARCHAR(20) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const postTable = `
 CREATE TABLE posts(
 post_id BIGSERIAL PRIMARY KEY NOT NULL,
 title VARCHAR(50) NOT NULL,
 body VARCHAR(200) ,
 user_id INT,
 status VARCHAR(20) NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
 );
`;

const followTable = `CREATE TABLE follows(
    id SERIAL PRIMARY KEY NOT NULL,
     followed_user_id INT REFERENCES users,
    following_user_id INT REFERENCES users,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const createPostTable = async () => {
  const client = await pool.connect();
  try {
    // await client.query(drop);
    const res = await client.query(postTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const createUserTable = async () => {
  const client = await pool.connect();
  try {
    // await client.query(drop);
    const res = await client.query(userTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const createFollowTable = async () => {
  const client = await pool.connect();
  try {
    // await client.query(drop);
    const res = await client.query(followTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

// createUserTable();
// createPostTable();
// createFollowTable();

module.exports = { pool };
