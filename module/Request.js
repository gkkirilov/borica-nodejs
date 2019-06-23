const crypto = require('crypto');

const utils = require('../utils/utils');

const REGISTER_TRANSACTION = 10;
const PAY_PROFIT = 11;
const DELAYED_AUTHORIZATION_REQUEST = 21;
const DELAYED_AUTHORIZATION_COMPLETE = 22;
const DELAYED_AUTHORIZATION_REVERSAL = 23;
const REVERSAL = 40;
const PAYED_PROFIT_REVERSAL = 41;

const PROTOCOL_VERSIONS = ['1.0', '1.1', '2.0'];

const GATEAWAY_URL = 'https://gate.borica.bg/boreps/';
const GATEAWAY_URL_TEST = 'https://gatet.borica.bg/boreps/';

class Request {
  constructor({
    terminalId,
    language = 'BG',
    protocolVersion = '1.0',
    currency = 'BGN'
  }) {
    this.terminalId = terminalId;
    this.transactionTimestamp = utils.getDateYMDHS();
    this.language = language;
    this.protocolVersion = protocolVersion;
    this.currency = currency;
    this.debug = process.env.BORICA_DEBUG_MODE == 'true';
  }

  getRegisterTransactionURL() {
    let message = this.getBaseMessage(REGISTER_TRANSACTION);
    return this.generateURL(message, 'registerTransaction');
  }

  getBaseMessage(messageType) {
    return (
      messageType +
      utils.getDateYMDHS() +
      this.transactionAmount +
      this.terminalId +
      this.orderId +
      this.orderDescription +
      this.language +
      this.protocolVersion
    );
  }

  generateURL(message, type) {
    let signedMessage = this.signMessage(message);
    let finalMessage = encodeURIComponent(signedMessage.toString('base64'));
    return this.getURL() + type + '?eBorica=' + finalMessage;
  }

  signMessage(message) {
    const sign = crypto.createSign('SHA1');
    sign.update(message);
    sign.end();
    let signature;
    if (process.env.BORICA_DEBUG_MODE == 'true') {
      signature = sign.sign(
        Buffer.from(process.env.BORICA_PRIVATE_KEY_TEST.toString())
      );
    } else {
      signature = sign.sign(
        Buffer.from(process.env.BORICA_PRIVATE_KEY.toString())
      );
    }
    return Buffer.concat([new Buffer(message), new Buffer(signature)]);
  }

  getURL() {
    return this.debug ? GATEAWAY_URL_TEST : GATEAWAY_URL;
  }

  setOrderId(value) {
    this.orderId = utils.pad(value, 15, ' ', 'right');
  }

  setTransactionAmount(value) {
    this.transactionAmount = utils.pad(value.toFixed(2) * 100, 12);
  }

  setOrderDescription(value) {
    this.orderDescription = utils.pad(value, 125, ' ', 'right');
  }
}

module.exports = Request;
