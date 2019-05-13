
(function() {
  var app, express, patient, patients, server;

  express = require("express");

//Sample data objects for clients/patients
  patients = {
    1: {
      patientId: 1,
      familyName: "Patient",
      givenName: "Sally",
      gender: "F",
      phoneNumber: "0731234567"
    },
    2: {
      patientId: 2,
      familyName: "Patient",
      givenName: "John",
      gender: "M",
      phoneNumber: "0739876543"
    }
  };

  patient = function(req, res, next) {
    console.log("Received patient request " + req.params.id);
    if (patients[req.params.id]) {
      res.json(patients[req.params.id]);
    } else {
      res.send(404, 'Not Found');
    }
    return res.end();
  };

  app = express();
  var path = require ('path');
  // app.use(express.static(path.join(__dirname + '.../mock_services/templates')));

  app.set('view engine', 'pug');
  app.set('views', 'templates');

  app.use(express.json());


  app.get("/patient/:id", patient);
  // app.get('/',function(req,res) {
  //   res.sendfile('templates/index.html');
  // });

  // app.get('/patient/:id', function(req, res) {
  //   res.render('editblog', { title: 'edit blog', id: req.params.id });
  // });

  app.get('/', function (req, res) {
    res.render('index', { data: 'Hello there!' })
  })


  server = app.listen(process.env.PORT || 3445, function() {
    return console.log("client-service running on port " + (server.address().port));
  });

}).call(this);
