import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'morgan';
import apiV1Router from './routes/api/v1/apiv1.js';
import apiV2Router from './routes/api/v2/apiv2.js';  // Only import the main router
import { models } from './models.js';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  req.models = models;
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Use the routers for api/v1 and api/v2
app.use('/api/v1', apiV1Router);
app.use('/api/v2', apiV2Router);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;
