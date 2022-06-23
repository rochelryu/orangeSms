const smsorange = require('../lib/');

let SMS = new smsorange("<Your Authorization header>","<Your Number>", "<Sender Name or Service Name>");
//Your Number Type : prefix + number (+225XXXXXXXX)
SMS.sendSms('numberOfReceiver', 'Your message. 👍');
//numberOfReceiver Type : prefix + number (+225XXXXXXXX)