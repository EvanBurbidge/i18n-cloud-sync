const express = require('express');
const { config } = require('./config');
const bp = require('body-parser');
const router = require('./router');
const auth = require('./auth');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bp.urlencoded({
  extended: true,
  limit: '100mb',
}));
app.use(bp.json({
  limit: '100mb',
}));

app.use(auth);


app.use('/', router);


app.listen(config.port || 3000, () => console.warn(`listening on ${config.port || 3000}`));
