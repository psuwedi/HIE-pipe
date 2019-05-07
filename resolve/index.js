module.exports = function (protocol, host, port, root_URL, id) {

DNS = require('dns');
SMS = require('../sms/send.js');

//Request data -> with defaults
protocol = protocol //http
host = host //'localhost';
port = port //'3444';
root_URL = root_URL //'encounters';
id = id //1
URL = protocol+'://'+host+':'+port+'/'+root_URL+'/'+id;
OBJ_URL = {
    "protocol":protocol,
    "host":host,
    "port":port,
    "root_URL": root_URL,
    "id":id
}
//Check if the URL is accessible
DNS.resolve(URL, (err) =>{
    if(err) {
        console.log("Cannot resolve service, sending SMS...");

        //Return the request data, which will then be sent via SMS
        return SMS(JSON.stringify(OBJ_URL));
       
    } else {
        console.log("Connected to service!")
    }
})
}