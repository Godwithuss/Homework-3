const express = require("express");
const { pool } = require("../database");
const router = express.Router();

router.post("/create", async (req, res) => {
  const client = await pool.connect();
  const { username, role } = req.body;
  const text = "INSERT INTO users(username,role) VALUES($1,$2) RETURNING *";
  const values = [username, role ? role : "user"];
  try {
    const result = await client.query(text, values);
    if (result.rows.length > 0) {
      return res.status(201).json({
        message: "created successfully!",
        data: result.rows[0],
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

router.get("/", async (req, res) => {
  const query = `SELECT * FROM users;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
    return res.status(200).json({
      message: "success",
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const query = `SELECT * FROM users WHERE user_id=$1;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [id]);
    return res.status(200).json({
      message: "success",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, role } = req.body;
  console.log({ username, role });
  const client = await pool.connect();
  try {
    const existinguser = await client.query(
      `SELECT * FROM users WHERE user_id=$1;`,
      [id]
    );

    // console.log(existinguser);
    if (existinguser) {
      const { role: rol, username: name } = existinguser.rows[0];
      const query = `UPDATE users SET ${
        username ? `username='${username}',` : `username='${name}',`
      } ${role ? `role='${role}'` : `role='${rol}'`} WHERE user_id=$1; `;
      const values = [id];
      const result = await client.query(query, values);
      return res.status(200).json({
        message: "updated",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM users WHERE user_id=$1;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [id]);
    return res.status(200).json({
      message: "deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
});

module.exports = router;
