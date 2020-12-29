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

//actualizar email en base al id (cif) de cada proveedor
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

//DELETE Method - Elimina todos los registros que se han ingresado con el POST

app.delete(BASE_API_PATH + "/providers", (req, res) => {
    console.log(Date() + "- DELETE /providers");
    db.remove({}, {multi: true}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});
    
//DELETE Method - Elimina 1 proveedor

app.delete(BASE_API_PATH + "/providers" + '/:id', (req, res) => {
    console.log(Date() + "- DELETE /providers/id");
    var cifID = req.params.id;
    db.remove({cif: cifID}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res,sendStatus(500);
        } else {
            res.sendStatus(200);
            console.log("Se elimino el Provedor con CIF: " + cifID);
        }
    });
});


app.listen(port);

console.log("Server ready...!!");
