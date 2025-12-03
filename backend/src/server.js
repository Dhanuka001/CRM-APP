const express = require('express');
const routes = require('./routes');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(routes);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
