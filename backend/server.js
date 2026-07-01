import express from 'express';
import router from './rotas.js';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use(router);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));