import axios from 'axios';

interface AccessTokenInterface {
  token_type: 'Bearer';
  access_token: string;
  expires_in: number;
  timeStamp: number;
}

export class SmsOrange {
  private yourNumber: string = '';
  private senderName = '';
  private authorizationHeader = '';
  private info: AccessTokenInterface = {
    token_type: 'Bearer',
    access_token: '',
    expires_in: 0,
    timeStamp: new Date().getTime(),
  };
  private AxiosInstance = axios.create();
  constructor(init: { authorization_header: string; yourNumber: string; senderName: string }) {
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

  async generateAccessToken(): Promise<any> {
    let postData = '';
    postData += 'grant_type=client_credentials';
    return new Promise(async (next) => {
      this.AxiosInstance.post('https://api.orange.com/oauth/v3/token', postData, {
        headers: {
          Authorization: this.authorizationHeader,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })
        .then((response: { data: any }) => {
          next({ ...response.data, timeStamp: new Date().setSeconds(3600) });
        })
        .catch((error: { message: unknown }) => {
          next(error.message);
        });
    });
  }

  getInfo() {
    return this.info;
  }

  async refreshTokenIfExpired(): Promise<any> {
    if (this.info.timeStamp < new Date().getTime()) {
      this.info = await this.generateAccessToken();
    }
  }

  async sendSms(data: { numberTo: string | string[]; message: string }): Promise<any[]> {
    if (data.message.trim().length < 1) {
      throw new Error('message is too short');
    }
    await this.refreshTokenIfExpired();
    const numbersTo = Array.isArray(data.numberTo) ? data.numberTo : [data.numberTo];
    const messagesPromises = numbersTo.map((numberReceive) => {
      if (numberReceive.indexOf('+') === -1) {
        throw new Error('Recipient number is incorrect, please use the format (prefix+number. Ex: +XXXXXXXXX)');
      }
      const recipientNumber = `tel:${numberReceive.replaceAll(' ', '').trim()}`;
      const uri = `https://api.orange.com/smsmessaging/v1/outbound/tel:${this.yourNumber}/requests`;
      return this.AxiosInstance.post(
        uri,
        {
          outboundSMSMessageRequest: {
            address: recipientNumber,
            senderAddress: `tel:${this.yourNumber}`,
            senderName: this.senderName,
            outboundSMSTextMessage: {
              message: data.message.trim(),
            },
          },
        },
        {
          headers: {
            Authorization: `${this.info.token_type} ${this.info.access_token}`,
            'Content-Type': 'application/json',
            'Accept-Charset': 'utf-8',
          },
        },
      )
        .then((response: { data: any }) => response.data)
        .catch((error: { message: string | undefined }) => {
          throw new Error(error.message);
        });
    });

    return Promise.all(messagesPromises);
  }

  async getBalanceAvailable(): Promise<any> {
    await this.refreshTokenIfExpired();
    return new Promise(async (next) => {
      this.AxiosInstance.get('https://api.orange.com/sms/admin/v1/contracts', {
        headers: {
          Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
        },
      })
        .then((response: { data: any }) => {
          const body = { ...response.data };
          next(body);
        })
        .catch((error: { message: unknown }) => {
          next(error.message);
        });
    });
  }

  async getStatisticsSmsSent(): Promise<any> {
    await this.refreshTokenIfExpired();
    return new Promise(async (next) => {
      this.AxiosInstance.get('https://api.orange.com/sms/admin/v1/statistics', {
        headers: {
          Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
        },
      })
        .then((response: { data: any }) => {
          const body = { ...response.data };
          next(body);
        })
        .catch((error: { message: unknown }) => {
          next(error.message);
        });
    });
  }

  async getPurchaseOrder(): Promise<any> {
    await this.refreshTokenIfExpired();
    return new Promise(async (next) => {
      this.AxiosInstance.get('https://api.orange.com/sms/admin/v1/purchaseorders', {
        headers: {
          Authorization: `${this.info.token_type} ${this.info.access_token}`, // ${this.info.access_token}
        },
      })
        .then((response: { data: any }) => {
          const body = { ...response.data };
          next(body);
        })
        .catch((error: { message: unknown }) => {
          next(error.message);
        });
    });
  }
}
