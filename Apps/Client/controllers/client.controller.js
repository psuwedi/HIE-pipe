const Client = require('../models/client.model');

//Simple action, for testing purposes.

exports.test = function (req, res) {
    res.send('Client service is working!')
};

exports.client_create = function (req, res) {
    let client = new Client({
    familyName: req.body.familyName,
    givenName: req.body.givenName,
    gender: req.body.gender,
    phoneNumber: req.body.phoneNumber
    });

    client.save( function (err){
        if(err) {
            return next(err);
        }
        res.send('Client created successfully')
    })
};

exports.client_details = function (req, res) {
    Client.findById(req.params.id, function(err, client) {
        if(err) return next(err);
        res.send(client);
    })

    
};