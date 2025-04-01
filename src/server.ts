require('dotenv').config();

import express from "express";
import cors from "cors";
import ChatRoutes from "./Routes/ChatRoutes";
import { errorHandler } from "./middleware/ErrorHandler";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use('/api/chat', ChatRoutes);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
