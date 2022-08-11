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
app.set('/images', path.join(__dirname, '/public/images'));

app.use(express.static(__dirname + '/public'))

app.get('*', checkUser);

app.get('/', (req, res) => {
    res.render('home')
})

app.use('/api/', apiRouteur)

app.listen(8080, () => {
    console.log('server en marche 8080')

})