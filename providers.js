const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema({
    cif: {
        type: String, 
        minlength: 9,
        required: true
        }, 
    name: {
        type: String,
        required: true
        }, 
    address: {
        type: String,
        required: true
        },
    cp: {
        type: Number,
        minlength: 5,
        required: true
        },
    phone: {
        type: Number,
        required: true
        },
    email: {
        type: String,
        required: true,
        match: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
      },
    code: {
        type: String,
        required: true
        },
    stock_sale: {
        type: Number,
        required: true
    }
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
