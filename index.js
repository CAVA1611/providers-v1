var express = require('express');
var bodyParser = require('body-parser');
var DataStore = require("nedb");

var port = 4500;
var BASE_API_PATH = "/api/v1";
var DB_FILE_NAME = __dirname+"/provider-v1.json";

console.log("Starting API Server...");


var app = express();
app.use(bodyParser.json());

var db = new DataStore({
    filename: DB_FILE_NAME,
    autoload: true 
});


app.get("/", (req, res) => {
    res.send("<html><body><h1>Microservicio Providers !!</h1></body></html>");
});

app.get(BASE_API_PATH + "/providers", (req, res) =>{
    console.log(Date() + "- GET /providers");
    db.find ({},(err,providers) =>{
        if (err) {
            console.log(Date() + "-" + err );
            res.sendStatus(500);
        }else {
            res.send(providers);
        }
    });
   
});

app.post(BASE_API_PATH + "/providers", (req, res) => {
    console.log(Date() + "- POST /providers");
    var provider = req.body;
    db.insert(provider,(err)=>{
        if (err) {
            console.log(Date() + "-" + err );
            res.sendStatus(500);
        }else {
            res.sendStatus(201);
        }

    });
});

app.put(BASE_API_PATH + "/providers" + "/:id" + "/email", (req, res) => {
    console.log(Date() + "- DELETE /providers/id/email");
    var email_prov = req.body.email;
    console.log(email_prov);
    var cifID = req.params.id;
    db.update({cif: cifID}, {$set:{email: email_prov}}, {multi: true}, (err) => {
    if (err) {
    console.log(Date() + " - " + err);
    res.sendStatus(500);
    } else {
    res.sendStatus(200);
    console.log("El email Acualizado es:" + email_prov)
    }
    });
});



app.listen(port);

console.log("Server ready...!!");
