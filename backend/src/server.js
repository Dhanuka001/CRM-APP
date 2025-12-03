const express = require('express');
const routes = require('./routes');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(routes);
app.use(errorHandler);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
