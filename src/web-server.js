const express = require('express');
const { config } = require('./config');
const bp = require('body-parser');
const router = require('./router');
const app = express();

app.use(bp.urlencoded({
  extended: true,
  limit: '100mb',
}));

app.use(bp.json({
  limit: '100mb',
}));



app.use('/', router);


app.listen(config.port || 3000, () => console.warn('listening on 3000'));
