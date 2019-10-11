const smsorange = require('../lib/');

let SMS = new smsorange("<Your Authorization header>","<Your Number>");

SMS.sendSms('numberOfReceiver', 'Your message. 😜');