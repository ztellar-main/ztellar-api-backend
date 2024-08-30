import { app } from './app';
import { server } from './app';
import 'dotenv/config';
import connectDB from './utils/db';

const port = process.env.PORT;
const socketport = process.env.SOCKETPORT;

server.listen(socketport, () => {
  console.log(`Server is running at port ${socketport}.`);
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}.`);
  connectDB();
});
