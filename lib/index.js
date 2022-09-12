"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsOrange = void 0;
const axios_1 = require("axios");
class SmsOrange {
    constructor(init) {
        this.yourNumber = '';
        this.senderName = '';
        this.authorizationHeader = '';
        this.info = {
            token_type: 'Bearer',
            access_token: '',
            expires_in: 0,
            timeStamp: new Date().getTime(),
        };
        this.AxiosInstance = axios_1.default.create();
        if (init.yourNumber.indexOf('+') === -1) {
            throw new Error('yourNumber is incorrect, please use the format (prefix+number. Ex: +XXXXXXXXX)');
        }
        if (init.senderName.trim().length < 2) {
            throw new Error('senderName is incorrect, min 2 characteres');
        }
        if (init.authorization_header.indexOf('Basic') === -1) {
            throw new Error('authorization_header is incorrect, this begin by Basic (Ex: Basic xxxxxxxxxxxxxxxxxxxxxxxxxx');
        }
        this.yourNumber = init.yourNumber.trim();
        this.senderName = init.senderName.trim();
        this.authorizationHeader = init.authorization_header.trim();
        // this.generateAccessToken();
    }
    async generateAccessToken() {
        let postData = '';
        postData += 'grant_type=client_credentials';
        return new Promise(async (next) => {
            this.AxiosInstance.post('https:// api.orange.com/oauth/v3/token', postData, {
                headers: {
                    Authorization: this.authorizationHeader,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Accept: 'application/json',
                },
            })
                .then((response) => {
                next({ ...response.data, timeStamp: new Date().setSeconds(3600) });
            })
                .catch((error) => {
                next(error.message);
            });
        });
    }
    getInfo() {
        return this.info;
    }
    async refreshTokenIfExpired() {
        if (this.info.timeStamp < new Date().getTime()) {
            this.info = await this.generateAccessToken();
        }
    }
    async sendSms(data) {
        if (data.numberTo.indexOf('+') === -1) {
            throw new Error('recipient number is incorrect, please use the format (prefix+number. Ex: +XXXXXXXXX)');
        }
        if (data.message.trim().length < 1) {
            throw new Error('message is too short');
        }
        await this.refreshTokenIfExpired();
        const recipientNumber = `tel:${data.numberTo.trim()}`;
        const uri = `https:// api.orange.com/smsmessaging/v1/outbound/tel:${this.yourNumber}/requests`;
        return new Promise(async (next) => {
            this.AxiosInstance.post(uri, {
                outboundSMSMessageRequest: {
                    address: recipientNumber,
                    senderAddress: `tel:${this.yourNumber}`,
                    senderName: this.senderName,
                    outboundSMSTextMessage: {
                        message: data.message.trim(),
                    },
                },
            }, {
                headers: {
                    Authorization: `${this.info.token_type} ${this.info.access_token}`,
                    'Content-Type': 'application/json',
                    'Accept-Charset': 'utf-8',
                },
            })
                .then((response) => {
                const body = { ...response.data };
                next(body);
            })
                .catch((error) => {
                next(error.message);
            });
        });
    }
    async getBalanceAvailable() {
        await this.refreshTokenIfExpired();
        return new Promise(async (next) => {
            this.AxiosInstance.get('https:// api.orange.com/sms/admin/v1/contracts', {
                headers: {
                    Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
                },
            })
                .then((response) => {
                const body = { ...response.data };
                next(body);
            })
                .catch((error) => {
                next(error.message);
            });
        });
    }
    async getStatisticsSmsSent() {
        await this.refreshTokenIfExpired();
        return new Promise(async (next) => {
            this.AxiosInstance.get('https:// api.orange.com/sms/admin/v1/statistics', {
                headers: {
                    Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
                },
            })
                .then((response) => {
                const body = { ...response.data };
                next(body);
            })
                .catch((error) => {
                next(error.message);
            });
        });
    }
    async getPurchaseOrder() {
        await this.refreshTokenIfExpired();
        return new Promise(async (next) => {
            this.AxiosInstance.get('https:// api.orange.com/sms/admin/v1/purchaseorders', {
                headers: {
                    Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
                },
            })
                .then((response) => {
                const body = { ...response.data };
                next(body);
            })
                .catch((error) => {
                next(error.message);
            });
        });
    }
}
exports.SmsOrange = SmsOrange;
