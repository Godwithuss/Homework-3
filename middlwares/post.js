const express = require("express");
const { pool } = require("../database");
const router = express.Router();

router.post("/:user_id/create", async (req, res) => {
  const client = await pool.connect();
  const { user_id } = req.params;
  const { title, body, status } = req.body;
  const query =
    "INSERT INTO posts(title,body,status, user_id) VALUES($1,$2,$3,$4) RETURNING *";
  const values = [title, body, status, user_id];
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
  const query = `SELECT * FROM posts WHERE user_id=$1;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query, [user_id]);
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

router.get("/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const query = `SELECT * FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);

    return res.status(200).json({
      message: "success",
      data: result.rows[0] || [],
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

router.patch("/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const { title, body, status } = req.body;

  const client = await pool.connect();
  try {
    const existingpost = await client.query(
      `SELECT * FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');`
    );
    if (existingpost) {
      const { title: t, body: b, status: st } = existingpost.rows[0];
      const query = `UPDATE posts SET 
      ${title ? `title='${title}',` : `title='${t}',`} 
      ${body ? `body='${body}',` : `body='${b}',`}
       ${status ? `status='${status}'` : `status='${st}'`} 
        WHERE(user_id='${user_id}' AND post_id='${post_id}'); `;

      const response = await client.query(query);

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

router.delete("/:user_id/:post_id", async (req, res) => {
  const { user_id, post_id } = req.params;
  const query = `DELETE FROM posts WHERE(user_id='${user_id}' AND post_id='${post_id}');;`;
  const client = await pool.connect();
  try {
    const result = await client.query(query);
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
