const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const userCtrl = require('./controllers/userCtrl');
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

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', userCtrl.register); 

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', userCtrl.login )

app.get('/post', (req, res) => {
    res.render('publication')
})

app.post('/post', upload.single('image'), (req, res) => {
    res.send('image uploaded')
})

app.get('/profil', (req, res) => {
    res.render('profil')
})


app.listen(8081, () => {
    console.log('server en marche 8081')

})