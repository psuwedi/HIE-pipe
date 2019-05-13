const Provider = require('../models/provider.model');

//Simple action, for testing purposes.

exports.test = function (req, res) {
    res.send('Provider service is working!')
};

exports.provider_create = function (req, res) {
    let provider = new Provider({
    familyName: req.body.familyName,
    givenName: req.body.givenName,
    title: req.body.title
    });

    provider.save( function (err){
        if(err) {
            return next(err);
        }
        res.send('Provider created successfully')
    })
};

exports.provider_details = function (req, res) {
    Provider.findById(req.params.id, function(err, provider) {
        if(err) return next(err);
        res.send(provider);
    })

    
};