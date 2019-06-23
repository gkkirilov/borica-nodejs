const crypto = require('crypto');

const utils = require('../utils/utils');

const REGISTER_TRANSACTION = 10;
const PAY_PROFIT = 11;
const DELAYED_AUTHORIZATION_REQUEST = 21;
const DELAYED_AUTHORIZATION_COMPLETE = 22;
const DELAYED_AUTHORIZATION_REVERSAL = 23;
const REVERSAL = 40;
const PAYED_PROFIT_REVERSAL = 41;
const PROTOCOL_VERSION_DEFAULT = '1.1';

const PROTOCOL_VERSIONS = ['1.0', '1.1', '2.0'];

const GATEAWAY_URL = 'https://gate.borica.bg/boreps/';
const GATEAWAY_URL_TEST = 'https://gatet.borica.bg/boreps/';

class Request {
  constructor({
    language = 'BG',
    protocolVersion = PROTOCOL_VERSION_DEFAULT,
    currency = 'BGN',
  }) {
    this.terminalId = process.env.BORICA_TERMINAL_ID;
    this.transactionTimestamp = utils.getDateYMDHS();
    this.language = language;
    this.protocolVersion = protocolVersion;
    this.currency = currency;
    this.debug = process.env.BORICA_DEBUG_MODE === 'true';
  }

  getRegisterTransactionURL() {
    const message = this.getBaseMessage(REGISTER_TRANSACTION);
    return this.generateURL(message, 'registerTransaction');
  }

  getStatusURL() {
    const message = this.getBaseMessage(REGISTER_TRANSACTION);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getRegisterDelayedRequestURL() {
    const message = this.getBaseMessage(DELAYED_AUTHORIZATION_REQUEST);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getCompleteDelayedRequestURL() {
    const message = this.getBaseMessage(DELAYED_AUTHORIZATION_COMPLETE);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getReverseDelayedRequestURL() {
    const message = this.getBaseMessage(DELAYED_AUTHORIZATION_REVERSAL);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getReverseURL() {
    const message = this.getBaseMessage(REVERSAL);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getPayProfitURL() {
    const message = this.getBaseMessage(PAY_PROFIT);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getPayedProfitReversalURL() {
    const message = this.getBaseMessage(PAYED_PROFIT_REVERSAL);
    return this.generateURL(message, 'transactionStatusReport');
  }

  getBaseMessage(messageType) {
    return (
      messageType
      + utils.getDateYMDHS()
      + this.transactionAmount
      + this.terminalId
      + this.orderId
      + this.orderDescription
      + this.language
      + this.protocolVersion
    );
  }

  generateURL(message, type) {
    const signedMessage = this.signMessage(message);
    const finalMessage = encodeURIComponent(signedMessage.toString('base64'));
    return `${this.getURL()}${type}?eBorica=${finalMessage}`;
  }

  static signMessage(message) {
    const sign = crypto.createSign('SHA1');

    sign.update(message);
    sign.end();
    let signature;
    if (process.env.BORICA_DEBUG_MODE === 'true') {
      signature = sign.sign(
        Buffer.from(process.env.BORICA_PRIVATE_KEY_TEST.toString()),
      );
    } else {
      signature = sign.sign(
        Buffer.from(process.env.BORICA_PRIVATE_KEY.toString()),
      );
    }

    return Buffer.concat([Buffer.from(message), Buffer.from(signature)]);
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

  setProtocolVersion(protocolVersion) {
    if (PROTOCOL_VERSIONS.includes(protocolVersion)) {
      this.protocolVersion = protocolVersion;
    }

    this.protocolVersion = PROTOCOL_VERSION_DEFAULT;
  }
}

module.exports = Request;
