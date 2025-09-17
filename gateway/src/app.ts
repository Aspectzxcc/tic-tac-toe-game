import express from 'express';
import cors from 'cors';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import registerSocketHandlers from './socket/index.js';
import routes from './routes/index.js';

const app = express();
export const server = createServer(app);

const corsOptions = {
  origin: "*", // 1. Explicitly enable all origins
  methods: "GET,POST,PUT,DELETE,OPTIONS", // 2. Allow all necessary methods
  allowedHeaders: "Origin,X-Requested-With,Content-Type,Accept,Authorization", // 3. Allow necessary headers
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

export const io = new Server(server, {
  cors: corsOptions
});

app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', routes);

app.use('/',(req, res)=>{
  res.send("hello world")
})

registerSocketHandlers(io);