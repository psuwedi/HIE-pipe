const apiKey = require('./config/keys').apiKey;
const apiSecret = require('./config/keys').apiSecret;
const Nexmo = require('nexmo')
const nexmo = new Nexmo({

    apiKey,
    apiSecret
})

const from = "OpenHIM"
const to = "2659943331"
const text = "Some aggregate data here..."

nexmo.message.sendSms(from, to, text, (err, responseData) => {
    if(err) {
        console.log("Error sending SMS")
    } else {
        if(responseData.messages[0]['status'] === "0") {
            console.log("Data sent successfully")
        } else {
            console.log(`Failed with error: ${responseData.messages[0]['error-text']}`)
        }
    }
});