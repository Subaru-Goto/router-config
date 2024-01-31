import "dotenv/config";
import express from "express";
import { usersRouter } from "./routes/users.js";

const app = express();
const PORT = process.env.port || 8002;
app.use(express.json());
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});
