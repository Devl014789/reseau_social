const fetch = require('node-fetch');
const localStorage = require('node-localstorage').LocalStorage;
let localStorageToken = new localStorage("./scratch");




exports.authToken = async (req, res, next) => {
    let myToken = localStorageToken.getItem("jwt-token")
    if(!myToken)res.redirect("login")
    next();
}

exports.isloged = async (req, res, next) => {
    let myToken = localStorageToken.getItem("jwt-token")
    if(myToken)res.redirect("post")
    next();
}

exports.register = async (req, res) => {   
    let reg = fetch("http://localhost:8080/api/user/register/", { 
        // Adding method type     
        method: "POST",      
        // Adding body or contents to send     
        body: JSON.stringify({       
            firstname: req.body.firstname,       
            lastname: req.body.lastname,       
            username: req.body.username,       
            email: req.body.email,       
            password: req.body.password,     }),      
            // Adding headers to the request     
            headers: {       
                "Content-type": "application/json",    
             },   
            })    
             // Converting to JSON     
             .then((response) => response.json())     
              // Displaying results to console     
              .then((json) => {      
                 console.log(json);       
                 if (json.message) {        
                     res.render("login", json)    
                     }else {         
                        res.render('register',json)       
                    }     })     
                    .catch((err) => {      
                         console.log("ICIIII", err);     
                        }); 
                    };

exports.login = async (req, res) => {
    let log = fetch("http://localhost:8080/api/user/login", {
        method: "post",
        body: JSON.stringify ({
            email: req.body.email,
            password: req.body.password,
        }),
        
        headers: {       
            "Content-type": "application/json",    
         }, 
    })
    .then((response) => response.json())
    .then((json) => {
        
        console.log(json);
        if (json.token) {
            res.redirect("post"),
            localStorageToken.setItem("jwt-token", json.token);
            
        } else {
            res.render('login', json)
        }
    })
    .catch((err) => {
        console.log(err);
    })
}

exports.updatep = async (req, res) => {
    let upd = await fetch("http://localhost:8080/api/updateuser", {
        method: "PUT",
        body: JSON.stringify ({
            token: localStorageToken.getItem('jwt-token'),
            username: req.body.username,
            lastname: req.body.lastname,
            firstname: req.body.firstname
        }),

        headers: {       
            "Content-type": "application/json",
            Authorization: localStorageToken.getItem("jwt-token"), 
         }, 
    })
    .then((response) => response.json())
    .then((json) => {
        res.render('profil', json)

        
})
}

exports.logout = async (req, res) => {
            localStorageToken.clear('jwt-token'),
            res.redirect('/')

}

exports.deleted = async (req, res) => {
    let del = fetch("http://localhost:8080/api/deleteuser", {
        method: "DELETE",
        headers: {
            "Content-type": "application/json",
            },
            body: JSON.stringify ({
                token: localStorageToken.getItem('jwt-token'),
            })
    })
    .then((response) => response.json())
    .then((json) => {
        console.log(json);
        res.render("login", json)
        localStorageToken.clear('jwt-token')
    })
}
