const app = require('./server.js');
const dbConnect = require('./db');

var port = (process.env.PORT || 4530);

console.log("Starting API Server at port "+ port);

dbConnect().then(
    () => {
        app.listen(port);
        console.log("Server ready...!!");
    },
    err => {
        console.log("Connection Error: " + err);
    }
)
