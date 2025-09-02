import dotenv from 'dotenv';
dotenv.config();

import app from './startup/app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/docs`);
});


