const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const apiRouteur = require('./back/apiRouteur').router;
// const {checkUser} = require('./utiles/authtoken');
const path = require('path');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './public/img')
    },
    filename: (req, file, callback) => {
        console.log(file);
        callback(null, Date.now() + path.extname(file.originalname));
    }
})  ;
const upload = multer({ storage: storage})





app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.set('/img', path.join(__dirname, '/public'));

app.use(express.static(__dirname + '/public'))

// app.get('*', checkUser);



app.use('/api/', apiRouteur)

app.listen(8080, () => {
    console.log('server en marche 8080')

})