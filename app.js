// Requirements and declarations
const path = require('path');
const express = require('express');
const lectures = require('./lectures');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'public/img')));

app.use('/', lectures);

// 404 error handler
function notFoundHandler(req, res, next) { // eslint-disable-line
  const title = '404';
  const message = 'Efni fannst ekki';
  res.status(404).render('error', {
    title, message,
  });
}

// 500 error handler
function errorHandler(err, req, res, next) { // eslint-disable-line
  console.error(err);
  const title = '500';
  const message = 'Villa';
  res.status(500).render('error', {
    title, message,
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

const hostname = '127.0.0.1';
const port = 3000;

app.listen(port, hostname, () => {
  console.info(`Server running at http://${hostname}:${port}/`);
});
