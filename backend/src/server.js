const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const config = require('./config');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const app = express();
app.use(helmet());
app.disable('x-powered-by');
app.use(requestLogger);
const allowedOrigins = [config.frontendOrigin];
const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    const err = new Error('Not allowed by CORS');
    err.statusCode = 403;
    callback(err);
  },
};

app.use(express.json());
app.use(cors(corsOptions));
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
