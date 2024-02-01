import "dotenv/config";
import express from "express";
import { usersRouter } from "./routes/users.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.port || 8002;
app.use(express.json());
app.use("/users", usersRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is listening on ${PORT}.`);
});
