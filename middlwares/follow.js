const express = require("express");
const { pool } = require("../database");
const router = express.Router();

router.post("/create", async (req, res) => {
  const client = await pool.connect();
  const { followed_user_id, following_user_id } = req.body;
  const query =
    "INSERT INTO follows(followed_user_id,following_user_id) VALUES($1,$2) RETURNING *;";
  const values = [followed_user_id, following_user_id];
  try {
    const result = await client.query(query, values);
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

router.get("/:user_id/", async (req, res) => {
  const { user_id } = req.params;
  const query = `SELECT * FROM follows WHERE followed_user_id='${user_id}';`;
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

router.delete("/:followed_user_id/:following_user_id", async (req, res) => {
  const { followed_user_id, following_user_id } = req.params;
  const query = `DELETE FROM follows  WHERE(followed_user_id='${followed_user_id}' AND following_user_id='${following_user_id}');`;
  const client = await pool.connect();
  try {
    await client.query(query);
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
