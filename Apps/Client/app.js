const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const patient = require('./routes/client.routes');

//initialize  express
const app = express();

app.use(express.static(path.join(__dirname, 'views/templates')));
app.use(cors());
app.set('view engine', 'pug');
app.set('views', 'views/templates');

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
app.use('/patient', patient);

app.get('/', function (req, res) {
    res.render('index')
  })

let port = 3445;

app.listen(port, () => {
    console.log(`Client application is running on port: ${port}`);
});