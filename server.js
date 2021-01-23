var express = require('express');
var bodyParser = require('body-parser');
var BASE_API_PATH = "/api/v1";
const Provider = require ('./providers');
const OrderResource = require('./orderResource.js');


var app = express();
app.use(bodyParser.json());


/////
app.get("/", (req, res) => {
    res.send("<html><body><h1>Providers V2 - Online Store</h1></body></html>");
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


//PUT Method para un actualizar ejm mail del proveedor 3
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

//actualizar todo el proveedor
app.put(BASE_API_PATH + "/provider"+"/:id", (req, res) => {
    console.log(Date() + "- PUT /provider/id");
    var cif_prov = req.body.cif;
    var name_prov = req.body.name;
    var address_prov = req.body.address;
    var cp_prov = req.body.cp;
    var email_prov = req.body.email;
    var phone_prov = req.body.phone;
    var code_prov = req.body.code;
    var stock_prov = req.body.stock_sale;
    var cifID = req.params.id;
    Provider.updateOne({cif: cifID}, {$set:{cif:cif_prov, 
        name: name_prov, 
        address: address_prov, 
        cp: cp_prov,
        email: email_prov,
        phone: phone_prov,
        code: code_prov,
        stock_sale: stock_prov}}, {multi: true}, (err)  => {
        if (err) {
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else {
            res.status(200).send('Provider Updated');
            console.log("Los datos del Proveedor han sido actualizados")
        }
      });
});

//DELETE Method - Elimina todos los proveedores

app.delete(BASE_API_PATH + "/providers", (req, res) => {
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
            res.sendStatus(204);
            console.log("Se elimino el Provedor con CIF:  " + cifID);
        }
    });
});



//integracion con MS Prdoducts

app.get(BASE_API_PATH + "/:id" + "/:stock", (req, res) => {
    console.log(Date() + "- Send info Stock");
    const aux = req.params.stock;
    Provider.findOne({cif: req.params.id}, (err, providers) => {
        if(err){
            console.log(Date() + " - " + err);
            res.sendStatus(500);
        } else{
            res.status(200).send(providers);
            console.log("Codigo del Producto: " + providers.code + 
            " -  stock Disponible: " + providers.stock_sale)
        }
        const prov_stock = providers.stock_sale;
        if(prov_stock < aux){
            console.log("NOT ENOUGH STOCK");
        }else{
            Provider.updateOne({cif: req.params.id}, {$set: {stock_sale: prov_stock - aux}}, {new: true}, 
                (err) => {
                    if(err){
                        console.log("NO se pudo");
                    }else{
                        console.log("Updated");
                    }
                })
        }
        
    })
})



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