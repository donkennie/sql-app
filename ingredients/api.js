const path = require("path");
const express = require("express");
const router = express.Router();

// client side static assets
router.get("/", (_, res) => res.sendFile(path.join(__dirname, "./index.html")));
router.get("/client.js", (_, res) =>
  res.sendFile(path.join(__dirname, "./client.js"))
);

/**
 * Student code starts here
 */

// connect to postgres
const pg = require("pg");
const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  database: "recipeguru",
  password: "lol",
  port: 5432,
});

router.get("/type", async (req, res) => {
  const { type } = req.query;
  console.log("get ingredients", type);

  // return all ingredients of a type
  const {rows} = await pool.query(
    `SELECT * FROM ingredients WHERE type = $1`, 
    [type]
  )

  res.json({rows});
});

router.get("/search", async (req, res) => {
  let { term, page } = req.query;
  page = page ? page : 0;
  console.log("search ingredients", term, page);

  let whereClause;
  const params = [page * 5];
  if(term){
    whereClause = `WHERE CONCAT(title, type) ILIKE $2`
    params.push(term);
  }

  const {rows} = await pool.query(
    `SELECT * FROM ingredients WHERE ${whereClause} OFFSET $1 LIMIT 5`,
    params
  );

  res.json({ rows});
});

/**
 * Student code ends here
 */

module.exports = router;
