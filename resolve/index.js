module.exports = function (protocol, host, port, root_URL, id) {

DNS = require('dns');
protocol = protocol //http
host = host //'localhost';
port = port //'3444';
root_URL = root_URL //'encounters';
id = id //1
URL = protocol+'://'+host+':'+port+'/'+root_URL+'/'+id;
DNS.resolve(URL, (err) =>{
    if(err) {
        console.log(err);
        return;
    } else {
        console.log("Connected to service!")
    }
})
}