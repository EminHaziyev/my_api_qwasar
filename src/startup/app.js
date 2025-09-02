import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { router as authRouter } from '../web/auth.routes.js';
import { router as animalsRouter } from '../web/animals.routes.js';
import docsRouter from './docs.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'Simple Animals API' });
});

app.use('/api/auth', authRouter);
app.use('/api/animals', animalsRouter);
app.use('/docs', docsRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

export default app;


