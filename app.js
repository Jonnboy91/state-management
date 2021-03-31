'use strict';
const cookieParser = require('cookie-parser')
const session = require('express-session')
const express = require('express');

const app = express();
const port = 3000;

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

app.get('/secret', (req, res) => {
  if(req.session.logged === true){
    return res.render('secret')
  }

  res.redirect('/form');


});

app.post('/login', (req, res) => {

  const username1 = req.body.username;
  const password1 = req.body.password;

  if(username1 === username && password1 === password){
    req.session.logged = true;
    res.redirect('/secret')
  } else {
    req.session.logged = false;
    res.redirect('/form')
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
