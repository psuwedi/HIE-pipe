const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const provider = require('./routes/provider.routes');

//initialize  express
const app = express();

//enable CORS
app.use(cors());

//setup  mongoose
const mongoose = require('mongoose');

let db_URL = 'mongodb://phidelis:roundrobin1@ds155396.mlab.com:55396/interop';
let mongoDB = process.env.MONGODB_URI || db_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'Could not connect to MongoDB:'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/providers', provider);

let port = 3446;

app.listen(port, () => {
    console.log(`Healthcare worker application is running on port: ${port}`);
});