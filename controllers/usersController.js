import { pool } from "../db/pool.js";
import { validationResult } from "express-validator";

export const getAllUsers = async (req, res) => {
  try{
    const { rows: users } = await pool.query(
      `
      SELECT *
      FROM users;
      `); 
    if(users.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send(users);
    }
  } catch(error) {
    res.status(500).send("Server error");
  }
};

export const getSingleUser = async (req, res) => {
  const { id } = req.params;
  try{
    const { rows: user} = await pool.query(
      `
      SELECT *
      FROM users
      WHERE id = $1;
      `, [id]);
    if(user.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send(user[0])
    };
  } catch(error) {
    res.status(500).send("Server Error");
  };
};

export const createNewUser = async (req, res) => {
  const { first_name, last_name } = req.body;
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.send({ error: result.array() });
  };

  try {
    const { rows: user } = await pool.query(

      `
      INSERT INTO users (first_name, last_name)
      VALUES ($1, $2) RETURNING *;
      `, [first_name, last_name]);

    if (user.length === 0) {
      res.sendStatus(400);
    } else {
      res.status(201).send(user[0]);
    };
  } catch (error) {
    res.status(500).send("Server error");
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.send({ error: result.array() });
  };

  const updateText =
   Object.entries(req.body).map(
    item => `${item[0]} = '${item[1]}'`)
    .join(",");

  const queryText = `
    UPDATE users
     SET ${updateText}
    WHERE id = $1
    RETURNING *`;

  try{
    const { rows: user } = await pool.query(queryText, [id]);
    if (user.length === 0) {
      res.sendStatus(400);
    } else {
      res.status(200).send(user[0]);
    };
  } catch(error) {
    res.status(500).send("Server error");
  };
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try{
    const { rows: user } = await pool.query(`
    DELETE FROM users
    WHERE id = $1
    RETURNING *;
    `, [id]);

    if ( user.length === 0) {
      res.sendStatus(404);
    } else {
      res.status(200).send(user[0]);
    }
  } catch(error) {
    res.sendStatus(500);
  }
};

export const checkExistingUser = async (req, res, next) => {
  const { id } = req.params;
    try {
      const { rows: user } = await pool.query(
        `
        SELECT id
        FROM users
        WHERE id = $1
        `, [id]);

      if (user.length === 0) {
        res.status(404).send("There is no user in the db.");
      } else {
        next();
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  };

