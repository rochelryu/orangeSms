import { SmsOrange } from '../index';

describe('smsOrange Test all EndPoint', () => {
  let smsWrapper: any;
  beforeAll(() => {
    smsWrapper = new SmsOrange({
      authorization_header: 'Basic xxxxxxxxxxxxxxxxxxxxx',
      yourNumber: '+XXXXXXXXXXXXX',
      senderName: 'Company Name',
    });
  });

  test('Get accessTocken and Expire Date', async () => {
    await smsWrapper.refreshTokenIfExpired();
    expect(smsWrapper.getInfo().expires_in).toBe(3600);
  });
  test('Get Balance info', async () => {
    const balance = await smsWrapper.getBalanceAvailable();
    expect(balance.partnerContracts.partnerId).toBe('dev orange email');
  });

  test('Send Message of Client', async () => {
    const recepientNumber = '+XXXXXXXXXXXXXXX';
    const message = 'Your Message here !';

    const response = await smsWrapper.sendSms({ numberTo: recepientNumber, message });
    expect(response.outboundSMSMessageRequest.senderName).toBe('<senderName>');
    expect(response.outboundSMSMessageRequest.senderAddress).toBe('tel:<yourNumber>');
    expect(response.outboundSMSMessageRequest.address[0]).toBe(`tel:${recepientNumber}`);
    expect(response.outboundSMSMessageRequest.outboundSMSTextMessage.message).toBe(message.trim());
  });
});
