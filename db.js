const mongoose = require('mongoose');
const DB_URL = ('mongodb+srv://cava_contacts:201010782@cluster0-contacts.p4c5m.mongodb.net/provi?retryWrites=true&w=majority')//(process.env.MONGO_URL || 'mongodb://db/test');


const dbConnect = function() {
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error: '));
    return mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
}

module.exports = dbConnect;