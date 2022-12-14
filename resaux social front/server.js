const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const userCtrl = require('./controllers/userCtrl');
const postCtrl = require('./controllers/postCtrl')
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

app.get('/', userCtrl.isloged, (req, res) => {
    res.render('home')
})

app.get('/register' , userCtrl.isloged, (req, res) => {
    res.render('register')
})

app.post('/register', userCtrl.register); 

app.get('/login', userCtrl.isloged, (req, res) => {
    res.render('login')
})

app.post('/login', userCtrl.login )

app.get('/post', userCtrl.authToken, (req, res) => {
    res.render('publication')
})

// app.post('/post', upload.single('image'), (req, res) => {
//     res.send('image uploaded')
// })

app.post('/post', postCtrl.newPost)

app.get('/profil', userCtrl.authToken, (req, res) => {
    res.render('profil')
})

app.post('/profil', userCtrl.updatep)

app.post('/logout', userCtrl.logout)

app.post('/delete', userCtrl.deleted)


app.listen(8081, () => {
    console.log('server en marche 8081')

})