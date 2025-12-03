const express = require('express');
const routes = require('./routes');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(routes);
app.use((req, res, next) => {
  const notFoundError = new Error('Not found');
  notFoundError.statusCode = 404;
  next(notFoundError);
});
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
