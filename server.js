var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";
const Provider = require ('./providers');


var app = express();
app.use(bodyParser.json());


/////
app.get("/", (req, res) => {
    res.send("<html><body><h1>Providers V2 - using MongoDB</h1></body></html>");
});

app.get(BASE_API_PATH + "/providers", (req, res) =>{
    console.log(Date() + "- GET /providers");
    Provider.find({}, (err, providers) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.send(providers.map((provider) => {
                return provider.cleanup();
            }));
        }
    });
    
});

app.post(BASE_API_PATH + "/providers", (req, res) => {
    console.log(Date() + "- POST /providers");
    var provider = req.body;
    Provider.create(provider, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(201);
        }
    });
});


//PUT Method para un actualizar un elemnto del proveedor 3
//"email":"provedor3@gmail.com"}
    
app.put(BASE_API_PATH + "/providers" + "/:id" + "/email", (req, res) => {
    console.log(Date() + "- DELETE /providers/id/email");
    var email_prov = req.body.email;
    console.log(email_prov);
    var cifID = req.params.id;
    Provider.updateOne({cif: cifID}, {$set:{email: email_prov}}, {multi: true}, (err)  => {
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
    Provider.deleteMany({}, {multi: true}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
});
    
//DELETE Method - Elimina uno (en este caso el proveedor 3)

app.delete(BASE_API_PATH + "/providers" + '/:id', (req, res) => {
    console.log(Date() + "- DELETE /providers/id");
    var cifID = req.params.id;
    console.log(cifID);
    Provider.deleteOne({cif: cifID}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res,sendStatus(500);
        } else {
            res.sendStatus(200);
            console.log("Se elimino el Provedor con CIF:  " + cifID);
        }
    });
});


app.put(BASE_API_PATH + "/providers" + "/:id" + "/email", (req, res) => {
    console.log(Date() + "- DELETE /providers/id/email");
    var email_prov = req.body.email;
    console.log(email_prov);
    var cifID = req.params.id;
    Provider.updateOne({cif: cifID}, {$set:{email: email_prov}}, {multi: true}, (err)  => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
            console.log("El email Acualizado es:" + email_prov)
        }
      });
});


module.exports = app;