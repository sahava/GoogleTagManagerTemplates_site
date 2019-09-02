const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const {authenticate} = require('./controllers/middleware/google-auth');

const indexRouter = require('./controllers/index');
const adminRouter = require('./controllers/admin');
const templateRouter = require('./controllers/template');
const categoriesRouter = require('./controllers/categories');
const searchRouter = require('./controllers/search');
const aboutRouter = require('./controllers/about');
const feedRouter = require('./controllers/feed');

const templateApi = require('./controllers/api.template');
const sessionApi = require('./controllers/api.session');
const gtmApi = require('./controllers/api.gtm');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authenticate);

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/template', templateRouter);
app.use('/categories', categoriesRouter);
app.use('/search', searchRouter);
app.use('/about', aboutRouter);
app.use('/feed', feedRouter);

app.use('/api/template', templateApi);
app.use('/api/session', sessionApi);
app.use('/api/gtm', gtmApi);

// catch 404 and forward to error handler
app.use((req, res, next) => next(createError(404)));

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = err;
  res.locals.stack = req.app.get('env') === 'development' ? err.stack : '';
  // render the error page
  res.status(err.status || 500);
  res.render('error', {title: 'Error'});
});

module.exports = app;
