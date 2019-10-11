'use strict'
let https = require('https');
let request = require('request');

module.exports = class smsorange {
    yourNumber = "";
    info = {};
    constructor(key, yourNumber) {
        this.yourNumber = yourNumber;
        let credentials = key;
        let postData = "";
        postData += "grant_type=client_credentials";
        try {
            let options = {
                host: 'api.orange.com',
                path: '/oauth/v2/token'
            };
            options['method'] = 'POST';
            options['headers'] = {
                'Authorization': credentials,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            };
        let req = https.request (options, (response) => {
                response.setEncoding('utf8');
                let responseData = '';
                response.on ('data', (data) => { responseData += data; });
                response.on ('end', () => {
                    let result = JSON.parse (responseData);
                    this.info = result;
        }).on('error', (e) => { console.log('err prem ', e) })
    });
        req.write(postData);
        req.end();
        }
    catch(err) { 
        console.log("Ryu say", err);
    }
    }

    send(number, message){
        let receveirr = "tel:"+ number;
        const uri = `https://api.orange.com/smsmessaging/v1/outbound/tel:${this.yourNumber}/requests`;
           let headers = {
               'Authorization': `Bearer ${this.info.access_token}`,
               'Content-Type': 'application/json',
               "Accept-Charset": "utf-8",
            };
            let body = {
                    outboundSMSMessageRequest: {
                address : receveirr, 
                    senderAddress : `tel:${this.yourNumber}`,
                outboundSMSTextMessage: {
                    message : message  
            }}};   
        let options = {
               uri:uri,
               method: 'POST',
               headers: headers,
               body: JSON.stringify(body)};
               request(options, (error, response) => {
            if (!error) {
               console.log(JSON.stringify(response.body));
               return response;
            }        
            else {
                console.log(error);
                return error;
            }
           })
        }
    sendSms(number, message){
        setTimeout(()=>{
            this.send(number, message)
        },10000);
    }
    
  }