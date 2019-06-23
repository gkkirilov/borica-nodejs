const crypto = require('crypto');

class Response {
  constructor() {
    if (process.env.BORICA_DEBUG_MODE == 'true') {
      this.publicCertificate = process.env.BORICA_PUBLIC_KEY_TEST;
    } else {
      this.publicCertificate = process.env.BORICA_PUBLIC_KEY;
    }
  }

  parse(message) {
    message = Buffer.from(message, 'base64');

    var wholeMessage = message.toString();
    this.transactionCode = wholeMessage.substring(0, 2);
    this.transactionTime = wholeMessage.substring(2, 16);
    this.amount = wholeMessage.substring(16, 28);
    this.terminalId = wholeMessage.substring(28, 36);
    this.orderId = Number(wholeMessage.substring(36, 51).trim());
    this.responseCode = wholeMessage.substring(51, 53);
    this.protocolVersion = wholeMessage.substring(53, 56);

    var data = message.toString().substring(0, message.length - 128);
    var messageSignature = message.toString().substring(message.length - 128);
    const verify = crypto.createVerify('SHA1');
    verify.update(data);
    verify.end();

    let signature = verify.verify(this.publicCertificate, messageSignature);
    return signature;
  }

  isSuccessful() {
    return this.responseCode == '00';
  }

  handleError() {
    switch (this.responseCode) {
      case '03':
        return 'The Merchant Category Code (DE 018) is not valid for the defined processing Code (DE  003).'
      case '04':
        return 'The acquirer should instruct the merchant to retain the card. No specific reason given.'
      case '05':
        return 'Transaction declined. No specific reason given'
      case '06':
        return 'Indicates an unspecified error in a previousmessage. When used in a 0420 reversal,indicates that the reason for the reversal wasdue to an error in a previous message'
      case '13':
        return 'Invalid amount'
      case '14':
        return 'Invalid card number (no such number)'
      case '15':
        return 'Unable to route at IEM'
      case '17':
        return 'Customer cancellation'
      case '80':
        return 'Issuer sign-off'
      case '33':
        return 'Expired card'
      case '36':
        return 'Restricted card'
      case '37':
        return 'Card acceptor call acquirer security'
      case '41':
        return 'Lost card'
      case '43':
        return 'Stolen card'
      case '51':
        return 'Not sufficient funds'
      case '54':
        return 'Expired card'
      case '57':
        return 'Transaction not permitted to cardholder'
      case '58':
        return 'Transaction not permitted to terminal'
      case '61':
        return 'Exceeds withdrawal amount limit'
      case '62':
        return 'Restricted card'
      case '65':
        return 'Exceeds withdrawal frequency limit'
      case '66':
        return 'Card acceptor call acquirer security department'
      case '85':
        return 'Transaction from type Reversal with same parameters is already registered.'
      case '86':
        return 'Transaction with the same parameters is already registered.'
      case '87':
        return 'Wrong protocol version'
      case '88':
        return 'For managing transactions. No parameter BOReq in request'
      case '89':
        return 'No primary transaction on which to execute this second one'
      case '90':
        return 'Card is not registered in Directory server'
      case '91':
        return 'Timeout from authorization service'
      case '92':
        return 'Executing check of transaction status. eBorica parameter is in wrong format'
      case '93':
        return 'Unsuccessful 3D authentication from ACS'
      case '94':
        return 'Discarded transaction'
      case '95':
        return 'Invalid signature of merchant'
      case '96':
        return 'Techinical error when processing the transaction'
      case '97':
        return 'Declined by fraud check'
      case '98':
        return 'Executing check of transaction status. For the send BOReq there is no registered BOResp inside of Borica'
      case '99':
        return 'Authorization declined by TPSS'
      default:
        return 'Unknown rror occurred'
    }
  }

  populateOrder(order) {
    order.transactionCode = this.transactionCode;
    order.transactionTime = this.transactionTime;
    order.totalPrice = this.amount;
    order.terminalId = this.terminalId;
    order.responseCode = this.responseCode;
    order.protocolVersion = this.protocolVersion;
  }

  confirm() {
    // Change order status and add specified period to user
  }
}

module.exports = BORes
