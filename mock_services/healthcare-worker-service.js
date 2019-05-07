
(function() {
  var app, express, provider, providers, server;

  express = require("express");
  resolve = require('../resolve/index.js');

  //Sample data objects for providers 

  providers = {
    1: {
      providerId: 1,
      familyName: "Doctor",
      givenName: "Dennis",
      title: "Dr"
    }
  };

  provider = function(req, res, next) {
    console.log("Received healthcare worked request " + req.params.id);
    if (providers[req.params.id]) {
      res.json(providers[req.params.id]);
    } else {
      res.send(404, 'Not Found');
    }
    return res.end();
  };

  app = express();

  app.use(express.json());

  app.get("/providers/:id", provider);

  //Handle 500
  app.get('/error500/:id', function(req, res, next) {
    res.status(500);
    resolve('http','localhost','3446','error500',1);
    res.send('Internal server error...');
  });
  


  server = app.listen(process.env.PORT || 3446, function() {
    return console.log("healthcare-worker-service running on port " + (server.address().port));
  });

}).call(this);
