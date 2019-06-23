module.exports = {
  getDateYMDHS() {
    const date = new Date();
    const yyyy = date.getFullYear().toString();
    const MM = this.pad(date.getMonth() + 1, 2);
    const dd = this.pad(date.getDate(), 2);
    const hh = this.pad(date.getHours(), 2);
    const mm = this.pad(date.getMinutes(), 2)
    const ss = this.pad(date.getSeconds(), 2)

    return yyyy + MM + dd + hh + mm + ss;
  },

  pad(number, length, symbol = '0', side = 'left') {
    var str = '' + number;
    while (str.length < length) {
      if (side == 'left') {
        str = symbol + str;
      } else {
        str = str + symbol;
      }
    }

    return str;
  }
};
