const fetch = require('node-fetch');

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
                     res.redirect("login")    
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
            res.redirect("post")
            
        } else {
            res.render('login', json)
        }
    })
    .catch((err) => {
        console.log(err);
    })
}


