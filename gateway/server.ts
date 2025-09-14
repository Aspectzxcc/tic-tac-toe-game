import server from './src/app.js';
import 'dotenv/config';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
