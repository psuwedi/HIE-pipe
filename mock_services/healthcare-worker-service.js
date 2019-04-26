
(function() {
  var app, express, provider, providers, server;

  express = require("express");
  resolve = require('../resolve/index.js');

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

  server = app.listen(process.env.PORT || 3446, function() {
    // resolve('http','localhost','3446','providers',1);
    return console.log("healthcare-worker-service running on port " + (server.address().port));
  });

}).call(this);
