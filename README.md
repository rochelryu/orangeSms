













![smsorange](http://www.thatquickmedia.com/images/smpp.jpg)



# smsorange

A Node.js module for send sms with bundle Orange.




## Installation

```sh
$ npm i smsorange
```









## Example






```js
"use strict"

const smsorange = require("smsorange")

// Promise interface
let SMS = new smsorange("<Your Authorization header>","<Your Number>", "<Sender Name or Service Name>" )
//Your Number Type : prefix + number (+225XXXXXXXX)

SMS.sendSms('numberOfReceiver', 'Your message. 👍');
//numberOfReceiver Type : prefix + number (+225XXXXXXXX)

// The message content-type UTF-8
//    More 160 char equal 2 Sms (same partition with message on GSM)
//        if your message is send one object is return and contain {statusCode, body, numberReceiver, NumberSender, HeaderQuery, URL, timestamp}
//        assert(statusCode, "201") ? the message is send with successful: the message is not send; 
//        In case Error, one error is return error
```






## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## License
See the [LICENSE][license] file.

## Autor
Rochel Ryu | Dev JS/TS Dart & Kotlin

[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
