module.exports.isValidFormatPin = (pin) => {
  const validPin = new RegExp(
    /((^\d{2}((0[0-9])|(10|11|12)\d{2})(([0-2][0-9])|(3[0-1])|(([7-8][0-9])|(6[1-9])|(9[0-1])))[-]\d{4}$)|(^\d{2}((0[0-9])|(10|11|12))(([0-2][0-9])|(3[0-1])|(([7-8][0-9])|(6[1-9])|(9[0-1])))[0-9]{4}$)|(^(19|20)[0-9]{2}((0[0-9])|(10|11|12))(([0-2][0-9])|(3[0-1])|(([7-8][0-9])|(6[1-9])|(9[0-1])))[0-9]{4}$))/g
  );

  return validPin.test(pin);
};
