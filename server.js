const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const apiRouteur = require('./back/apiRouteur').router;
const {checkUser} = require('./utiles/authtoken');
const path = require('path');




app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('/img', path.join(__dirname, '/public'));

app.use(express.static(__dirname + '/public'))

app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/post', (req, res) => {
    res.render('publication')
})

// app.get('/profil', (req, res) => {
//     res.render('profil')
// })


app.use('/api/', apiRouteur)

app.listen(8080, () => {
    console.log('server en marche 8080')

})