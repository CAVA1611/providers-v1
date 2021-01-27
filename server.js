var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";
const Provider = require ('./providers');
const OrderResource = require('./orderResource.js');
const passport = require('passport');
require('./passport.js');


var app = express();
app.use(bodyParser.json());
app.use(passport.initialize());



/////
app.get("/",
    passport.authenticate('localapikey', {session: false}),    
    (req, res) => {
    res.send("<html><body><h1>Providers V2 - Online Store</h1></body></html>");
});

app.get(BASE_API_PATH + "/providers", 
    passport.authenticate('localapikey', {session: false}),
    (req, res) =>{
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

app.post(BASE_API_PATH + "/providers",
    passport.authenticate('localapikey', {session: false}),    
    (req, res) => {
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


//PUT Method para un actualizar ejm mail del proveedor 3
//"email":"provedor3@gmail.com"}
// el id para el caso de los Proveedores hace referencia  al CIF
    
app.put(BASE_API_PATH + "/providers" + "/:id" + "/email",
    passport.authenticate('localapikey', {session: false}), 
    (req, res) => {
    console.log(Date() + "- DELETE /providers/id/email");
    Provider.updateOne({cif: req.params.id},
        {$set:{email: req.body.email}}, 
        {multi: true}, (err)  => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send('Updated email');
        }
      });
});

//actualizar todo el proveedor

app.put(BASE_API_PATH + "/providers" + "/:id",
    passport.authenticate('localapikey', {session: false}),
    (req, res) => {
    console.log(Date() + "- DELETE /providers/id");
    Provider.updateOne({cif: req.params.id}, {$set:{cif: req.body.cif, 
        name: req.body.name, 
        address: req.body.address, 
        cp: req.body.cp,
        email: req.body.email,
        phone: req.body.phone,
        code: req.body.code,
        stock_sale: req.body.stock_sale}}, {multi: true}, (err)  => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send('Updated Provider');
        }
      });
});

//DELETE Method - Elimina todos los proveedores

app.delete(BASE_API_PATH + "/providers",
    passport.authenticate('localapikey', {session: false}),
    (req, res) => {
    console.log(Date() + "- DELETE /providers");
    Provider.deleteMany({}, {multi: true}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.sendStatus(204);
        }
    });
});
    

//DELETE Method - Elimina un provedor (el parametro id que se pasa es el CIF)

app.delete(BASE_API_PATH + "/providers" + '/:id',
    passport.authenticate('localapikey', {session: false}),
    (req, res) => {
    console.log(Date() + "- DELETE /providers/id");
    Provider.deleteOne({cif: req.params.id}, (err) => {
        if (err) {
            console.log(Date() + " - " + err);
            res,sendStatus(500);
        } else {
            res.status(204).send('Deleted Provider');
        }
    });
});



//integracion con MS Prdoducts

app.get(BASE_API_PATH + "/:id" + "/:stock", (req, res) => {
    console.log(Date() + "- Send info Stock");
    var aux = Number(req.params.stock);
    Provider.findOne({cif: req.params.id}, (err, providers) => {
        if(err){
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else{
            
            console.log("Codigo del Producto: " + providers.code + 
            " -  stock Disponible: " + providers.stock_sale)
        }
        const prov_stock = providers.stock_sale;
        var stock= prov_stock + aux;
        if(stock <0){
            console.log("NOT ENOUGH STOCK");
            res.status(500).send("0");
        }else{
            Provider.updateOne({cif: req.params.id}, {$set: {stock_sale: stock}}, {new: true}, 
                (err) => {
                    if(err){
                        res.status(500).send("0");
                        console.log("NO se pudo");
                    }else{
                        console.log("Updated");
                        res.status(200).send("1");
                        
                    }
                })
        }
        
    })
});

// Get de proveedores por id (CIF del provvedor) - solicitado por MS Products

app.get(BASE_API_PATH + "/providers" + "/info" + "/:id", 
    passport.authenticate('localapikey', {session: false}),
    (req, res) =>{
    console.log(Date() + "- GET /providers/id");
    Provider.findOne({cif: req.params.id}, (err, providers) => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send(providers);
        }
    });
    
});


//////integarcion con MS Orders

app.get(BASE_API_PATH+ "/orders", (req,response)=>{
    console.log(Date() + " - GET /orders");

    OrderResource.getAllOrders()
        .then((body)=>{
            response.send(body);
        })
        .catch((error)=>{
            console.log("error: "+error);
            response.sendStatus(500);
        })
});


module.exports = app;