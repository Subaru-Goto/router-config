import { pool } from "../db/pool.js";
import { validationResult } from "express-validator";

export const getAllUsers = async (req, res) => {
  try{
    const queryText = `SELECT * FROM users;`
    const { rows: users } = await pool.query(queryText); 
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
    const queryText = `SELECT * FROM users WHERE id = $1;`;
    const { rows: user} = await pool.query(queryText, [id]);
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
    const queryText = `
      INSERT INTO users (first_name, last_name)
      VALUES ($1, $2) RETURNING *;
    `
    const { rows: user } = await pool.query(queryText, [first_name, last_name]);

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

  // Bad example - having a risk of sql injection
  // const updateText =
  //  Object.entries(req.body).map(
  //   item => `${item[0]} = '${item[1]}'`)
  //   .join(",");

  const updateColumns = Object.keys(req.body);
  const updateValues = Object.values(req.body);
  // $1 is taken for id so starting from 2
  const updateText = updateColumns.map(
    (column, index) => `${column} = $${index + 2}`
    ).join(",");

  const queryText = `
    UPDATE users
     SET ${updateText}
    WHERE id = $1
    RETURNING *`;

  try{
    const { rows: user } = await pool.query(queryText, [id, ...updateValues]);
    if (user.length === 0) {
      res.sendStatus(400);
    } else {
      res.status(200).send(user[0]);
    };
  } catch(error) {
    res.status(500).send(error.message);
  };
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try{
    const queryText = `
      DELETE FROM users
      WHERE id = $1
      RETURNING *;
    `;
    const { rows: user } = await pool.query(queryText, [id]);

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
      const queryText = `
        SELECT id
        FROM users
        WHERE id = $1;
      `;
      const { rows: user } = await pool.query(queryText, [id]);

      if (user.length === 0) {
        res.status(404).send("There is no user in the db.");
      } else {
        next();
      }
    } catch (error) {
      res.status(500).send("server error");
    }
  };

