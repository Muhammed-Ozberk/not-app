require('dotenv').config();
const express = require('express');
const app = express();
const app_router = require('./src/router/app_router');
const admin_router = require('./src/router/admin_router');
const sequelize = require('./src/db/database');
const session = require('express-session');
const flash = require('connect-flash');
const Sequelize = require('sequelize');
const cookieParser = require("cookie-parser");

//template engine setting
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayouts);
app.use(express.static('public'));
app.use("/uploads", express.static(path.join(__dirname, '/src/uploads')));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

//session setting
const SequelizeStore = require("connect-session-sequelize")(session.Store);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize,
      checkExpirationInterval:5*60*1000, 
      expiration: 55 *60 * 1000
    }),
    resave: false,
    proxy: true,
  })
);

app.use(flash());
//flash message
app.use((req, res, next) => {
  res.locals.validation_error = req.flash('validation_error');
  res.locals.success_message = req.flash('success_message');
  res.locals.email = req.flash('email');
  res.locals.password = req.flash('password');
  res.locals.repassword = req.flash('repassword');
  res.locals.login_error = req.flash('error');
  res.locals.users = req.flash('users');
  res.locals.dashData = req.flash('dashData');
  next();
});

const errorRouter = require('./src/router/404_error');
app.use('/admin', admin_router);
app.use('/', app_router);
app.use(errorRouter);


sequelize.sync();


app.listen(process.env.PORT, () => {
  console.log(`Server ${process.env.PORT} portundan ayaklandı`);
});