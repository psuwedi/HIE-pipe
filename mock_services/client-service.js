
(function() {
  var app, express, patient, patients, server;

  express = require("express");

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

  app.use(express.json());

  app.get("/patient/:id", patient);

  server = app.listen(process.env.PORT || 3445, function() {
    return console.log("client-service running on port " + (server.address().port));
  });

}).call(this);
