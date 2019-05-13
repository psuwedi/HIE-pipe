const mongoose = require('mongoose');
const Schema =  mongoose.Schema;

let ProviderSchema = new Schema({
    familyName: {type: String, required: true, max: 100 },
    givenName: {type: String, required: true, max: 100 },
    title: {type: String, required: true, max: 6 }
    
})

//export model

module.exports = mongoose.model('Provider', ProviderSchema);