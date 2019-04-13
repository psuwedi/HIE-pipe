
(function() {
  var app, encounters, express, records, server;

  express = require("express");

  records = {
    1: {
      patientId: 1,
      providerId: 1,
      encounterType: "Physical Examination",
      encounterDate: "20131023",
      observations: [
        {
          obsType: "Weight",
          obsValue: "50",
          obsUnit: "kg"
        }, {
          obsType: "Height",
          obsValue: "160",
          obsUnit: "cm"
        }, {
          obsType: "Systolic Blood Pressure",
          obsValue: "120",
          obsUnit: "mmHg"
        }, {
          obsType: "Diastolic Blood Pressure",
          obsValue: "80",
          obsUnit: "mmHg"
        }, {
          obsType: "Heartrate",
          obsValue: "90",
          obsUnit: "bpm"
        }, {
          obsType: "Temperature",
          obsValue: "37",
          obsUnit: "C"
        }
      ]
    },
    2: {
      patientId: 2,
      providerId: 1,
      encounterType: "Physical Examination",
      encounterDate: "20140517",
      observations: [
        {
          obsType: "Weight",
          obsValue: "88",
          obsUnit: "kg"
        }, {
          obsType: "Height",
          obsValue: "180",
          obsUnit: "cm"
        }, {
          obsType: "Systolic Blood Pressure",
          obsValue: "138",
          obsUnit: "mmHg"
        }, {
          obsType: "Diastolic Blood Pressure",
          obsValue: "93",
          obsUnit: "mmHg"
        }, {
          obsType: "Heartrate",
          obsValue: "97",
          obsUnit: "bpm"
        }, {
          obsType: "Temperature",
          obsValue: "37",
          obsUnit: "C"
        }
      ]
    }
  };

  encounters = function(req, res, next) {
    console.log("Received health record request for patient #" + req.params.patientId);
    if (records[req.params.patientId]) {
      res.json(records[req.params.patientId]);
    } else {
      res.send(404, 'Not Found');
    }
    return res.end();
  };

  app = express();

  app.use(express.json());

  app.get("/encounters/:patientId", encounters);

  server = app.listen(process.env.PORT || 3444, function() {
    return console.log("health-record-service running on port " + (server.address().port));
  });

}).call(this);
