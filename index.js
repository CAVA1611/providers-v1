var express = require('express');
var bodyParser = require('body-parser');

var port = 4500;
var BASE_API_PATH = "/api/v1";

var providers = [
    {"cif": "A58818501", "name": "Proveedor 1", "address": "Sevilla", "cp":"20011", "phone": "0976543234", "email":"provedor1@gmail.com"},
    {"cif": "A56783245", "name": "Proveedor 2", "address": "Madrid", "cp":"21832", "phone": "0987635241", "email":"provedor2@gmail.com"}
];

console.log("Starting API Server...");


var app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("<html><body><h1>Microservicio Providers !!</h1></body></html>");
});

app.get(BASE_API_PATH + "/providers", (req, res) =>{
    console.log(Date() + "- GET /providers");
    res.send(providers);
});

app.post(BASE_API_PATH + "/providers", (req, res) => {
    console.log(Date() + "- POST /providers");
    var provider = req.body;
    providers.push(provider);
    res.sendStatus(201);
});

app.listen(port);

console.log("Server ready...!!");
