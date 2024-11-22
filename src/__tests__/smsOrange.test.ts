import { SmsOrange } from '../index';

describe('smsOrange Test all EndPoint', () => {
  let smsWrapper: any;
  beforeAll(() => {
    smsWrapper = new SmsOrange({
      authorization_header: 'Basic XXXXXXXXXXXXXXXXXXXXXXXXXXXXX==',
      yourNumber: '+225XXXXXXXXXX',
      senderName: 'XXXXXXXX',
    });
  });

  test('Get accessTocken and Expire Date', async () => {
    await smsWrapper.refreshTokenIfExpired();
    expect(smsWrapper.getInfo().expires_in).toBe(3600);
  });
  test('Get Balance info', async () => {
    const balance = await smsWrapper.getBalanceAvailable();
    expect(balance[0].offerName).toBe('SMS_OCB');
  });

  test('Send Message of Client', async () => {
    const recepientNumber = ['+2250564250219', '+2250700924216', '+2250142081716'];
    const message = 'Your Message here !';

    const response = await smsWrapper.sendSms({ numberTo: recepientNumber, message });
    expect(response[0].outboundSMSMessageRequest.senderName).toBe('<senderName>');
    expect(response[0].outboundSMSMessageRequest.senderAddress).toBe('tel:<yourNumber>');
    expect(response[0].outboundSMSMessageRequest.address[0]).toBe(`tel:${recepientNumber[0]}`);
    expect(response[0].outboundSMSMessageRequest.outboundSMSTextMessage.message).toBe(message.trim());
  });
});
