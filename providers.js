const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    cif: {type: String, minlength: 9}, 
    name: String, 
    address: String,
    cp: Number,
    phone: Number,
    email: String,
    code: String,
    stock_sale: Number
});

providerSchema.methods.cleanup = function() {
    return {    cif: this.cif, 
        name: this.name, 
        address: this.address, 
        cp: this.cp, 
        phone: this.phone, 
        email: this.email,
        code: this.code,
        stock_sale: this.stock_sale
    };
}
 

const Provider = mongoose.model('Provider', providerSchema);

module.exports = Provider;
