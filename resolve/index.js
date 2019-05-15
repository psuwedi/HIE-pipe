module.exports = function (protocol, host, port, root_URL, id) {

axios = require('axios');

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

    
    service_root_URL = '';

    if(port = 3445 ) {
      service_root_URL = 'providers';
      port = 3446;

    } else {
        service_root_URL = 'patient';
    }
    

    if(err) {
        console.log("Cannot resolve service, sending SMS...");

        URL = protocol+'://'+host+':'+port+'/'+service_root_URL+'/'+id;

        axios.get(URL)
            .then(function (response) {
                data = {};
                data = response.data;
                console.log(data);
                //Return the request data, which will then be sent via SMS
                 return SMS(JSON.stringify(data));
            })
            .catch(function (error) {
                data = "error retrieving data.";
                console.log(error);
            });

        
       
    } else {
        console.log("Connected to service!")
    }
})
}