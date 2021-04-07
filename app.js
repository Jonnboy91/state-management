'use strict';
const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express');
const passport = require('./utils/pass');

const app = express();
const port = 3000;

const loggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect('/form');
  }
};

const username = 'foo';
const password = 'bar';

app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(cookieParser());
app.use(session({
  secret: "Shh, its a secret!",
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60*60*24},
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('views', './views');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/setCookie/:clr', (req, res) =>{
  res.cookie('color', req.params.clr, {httpOnly: true}).send('cookie set');
});

app.get('/deleteCookie', (req, res) =>{
  res.clearCookie('color');
  res.send('cookie color cleared');
});

app.get('/form', (req, res) => {
  res.render('form')
});

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/form'}),
    (req, res) => {
      console.log('success');
      res.redirect('/secret');
    });

// modify app.get('/secret',...
app.get('/secret', loggedIn, (req, res) => {
  res.render('secret');
});

app.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
