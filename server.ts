import { app } from "./app";
import "dotenv/config";
import connectDB from "./utils/db";

const port = process.env.PORT;


app.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
  connectDB();
});
