













![smsorange](https://img.freepik.com/vecteurs-libre/nouvelle-illustration-concept-message_114360-636.jpg)



# smsorange

**A Node.js module for send sms with bundle Orange**.
The _Orange api Sms_ allows you to send SMS in the whole area of **West Africa**, **Central Africa** and **France**.
Orange sms api is entirely based on _Bearer token authentication_. This token is sent by Orange and usually expires in _1 hour (3600 sec)_.
So you have to watch the expiration period of the token before doing anything.
**_The smsorange package manages it for you and offers you a wide range of nested methods allowing you to concentrate on your code logic_**.




## Installation

```sh
$ npm i smsorange
```









## Initialize






```ts
"use strict"

import { SmsOrange } from 'smsorange'

// Promise interface
const smsWrapper = new SmsOrange({authorization_header:"<Your Authorization header>",
    yourNumber: "<Your Number>",
    senderName: "<Sender Name or Service Name>"
    )
//Your Authorization header is available on DEV ORANGE DASHBORD FOR YOUR APP (SIDE)
//Your Number Type : prefix + number (+225XXXXXXXX)
//senderName have minLength = 2
```


---
## How to send Message (plugin generate accessToken auto if it is expired)

```ts
const response = await smsWrapper.sendSms({numberTo: 'numberOfReceiver', message:'Your message. 👍'});

//numberTo Type : prefix + number (+225XXXXXXXX)

// The message content-type UTF-8
//    More 160 char equal 2 Sms (same partition with message on GSM)
// response return this :
/*  {
        outboundSMSMessageRequest: {
            address: [ 'tel:numberTo' ],
            senderAddress: 'tel:yourNumber',
            outboundSMSTextMessage: {
                message: message,
            },
            resourceURL: string,
        }
    }
*/
```

---
## How get Balance
From your application, or inside your own administration zone, you may have the need to check and display how many SMS you can still send to your customers.

```ts

const balance = await smsWrapper.getBalanceAvailable();

// balance return this :
/*  {
        partnerContracts: {
            partnerId: "Your email of Orange Developper",
            contracts: [
                {
                    "service":"SMS_OCB",
                    "contractDescription":"Your SMS balance (per country)",
                    "serviceContracts":[
                        {
                            "country":string,
                            "service":"string,
                            "contractId":string,
                            "availableUnits": <number Message rest>,
                            "expires":<date of end bundle susbscription>,
                            "scDescription":string
                        }
                    ]
                }
            ]
        }
    }
*/
```

---
## How get Statistics of messages already sent
From your application or inside your own administration zone, you may need to track how many SMS has been sent per application and/or country. For this usage.

```ts

const balance = await smsWrapper.getStatisticsSmsSent();

// balance return this :
/*  {
        partnerStatistics: {
            partnerId: "Your email of Orange Developper",
            statistics: [{
                "service":string,
                "serviceStatistics":[
                    {
                        "country":string,
                        "countryStatistics":[
                            {
                                "applicationId":string,
                                "usage":number
                            },
                            {
                                "applicationId":string,
                                "usage":number
                            }
                        ]
                    }
                ]
            }]
        }
    }
*/
```

---
## How get purchase history of payement bundle
Last but not least for the account management API, you may also need to track all the purchased orders you did with your account.

```ts

const balance = await smsWrapper.getPurchaseOrder();

// balance return this :
/*  {
        purchaseOrders: [
        {
            "purchaseOrderId":"24031977",
            "mode":"OCB",
            "bundleId":"bc8cda15-3409-495a-b5ab-87c7017816b1",
            "bundleDescription":"Bundle 2 - 500 SMS for 15 000 FCFA)",
            "partnerId":"53laht-s1-3r0m-naht-3m0s3wa",
            "inputs":[
                {
                    "type":"MSISDN",
                    "value":"+22557....11"
                },
                {
                    "type":"bundleId",
                    "value":"bc8cda15-3409-495a-b5ab-87c7017816b1"
                },
                {
                    "type":"confirmationCode",
                    "value":"22....10"
                },
                {
                    "type":"challengeMethod",
                    "value":"OTP-SMS-OCB"
                }
            ],
            "orderExecutioninformation":{
                "date":"2015-04-01T14:38:40",
                "amount":15000,
                "currency":"XOF",
                "service":"SMS_OCB",
                "country":"CIV",
                "contractId":"211...7-a121-46f2-933c-cd4...67"
            }
        }]
    }
*/
```

---




## How to contribute
Have an idea? Found a bug? See [how to contribute][contributing].


## License
See the [LICENSE][license] file.

## Autor
Rochel Ryu | Dev JS/TS Dart & Kotlin

## Which uses this package
<a href='https://www.shouz.network' target='_blank'><img src="https://www.shouz.network/static/media/logo-7.e73ba927.png" width="33" height="40" /></a>

[license]: /LICENSE
[contributing]: /CONTRIBUTING.md
[docs]: /DOCUMENTATION.md
