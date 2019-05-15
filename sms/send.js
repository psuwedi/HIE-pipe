module.exports = function sendMsg(text) {
    const apiKey = require('./config/keys').apiKey;
    const apiSecret = require('./config/keys').apiSecret;
    const Nexmo = require('nexmo');
    const nexmo = new Nexmo({

        apiKey,
        apiSecret
    })

    const from = "HIE Pipe"
    const to = "265991166683" // You can use any valid phone number here!
    // const text = "{Some aggregate data here...}"

    nexmo.message.sendSms(from, to, text, (err, responseData) => {
        if(err) {
            console.log("Error sending SMS")
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Data sent successfully via SMS")
            } else {
                console.log(`Failed with error: ${responseData.messages[0]['error-text']}`)
            }
        }
    });
}
