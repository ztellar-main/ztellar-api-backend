import { app } from './app';
import { server } from './app';
import 'dotenv/config';
import connectDB from './utils/db';

const port = process.env.PORT;

server.listen(port, '0.0.0.0' as any, () => {
  console.log(`Server is running at port ${port}.`);
  connectDB();
});

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}.`);

// });
