const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ClientSchema =  Schema({
    familyName: {type: String, required: true, max: 100 },
    givenName: {type: String, required: true, max: 100 },
    gender: {type: String, required: true, max: 6 },
    phoneNumber: {type: String, required: true, max: 15 }
});

//export model
module.exports = mongoose.model('Client', ClientSchema);