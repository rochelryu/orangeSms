const smsorange = require('../lib/');

let SMS = new smsorange("<Your Authorization header>","<Your Number>");
//Your Number Type : prefix + number (+22501020304)
SMS.sendSms('numberOfReceiver', 'Your message. 😜');
//numberOfReceiver Type : prefix + number (+22505060708)