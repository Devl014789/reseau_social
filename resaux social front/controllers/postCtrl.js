const { log } = require('console');
const fetch = require('node-fetch');
const { json, text } = require('stream/consumers');
const localStorage = require('node-localstorage').LocalStorage;
let localStorageToken = new localStorage("./scratch");


exports.newPost = async (req, res) => {
    
    let newP = fetch('http://localhost:8080/api/post/new', {
        method: 'POST',

        body: JSON.stringify ({
            text: req.body.text,
            image: req.body.image,
            token: localStorageToken.getItem('jwt-token'),
        }),

        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        res.render('publication', json)
    })
    .catch((err) => {      
        console.log(err);     
       }); 
   
}

exports.allPost = async (req, res) => {
    
    const text = fetch('http://localhost:8080/api/post')
    .then((response) => response.json())
    .then((json) => json.text)

    const image = fetch('http://localhost:8080/api/post')
    .then((response) => response.json())
    .then((json) => json.image)

    const like = fetch('http://localhost:8080/api/post')
    .then((response) => response.json())
    .then((json) => json.like)


    document.querySelector('#textp').textContent = text;
    document.querySelector('#image').imageContent = image;
    document.querySelector('#like').textContent = like;

    console.log(json);
    
}