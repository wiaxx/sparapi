module.exports.isValidSwedishPin = (pin) => {
  pin = pin.replace(/\D/g, '').split('').reverse().slice(0, 10);

  if (pin.length != 10) {
    return false;
  }

  const sum = pin
    .map((n) => {
      return Number(n);
    })
    .reduce((previous, current, index) => {
      if (index % 2) current *= 2;
      if (current > 9) current -= 9;
      return previous + current;
    });

  const sumWithoutCheck = sum - Number(pin[0]);

  const lastDigitOfSum = String(sumWithoutCheck)
    .split('')
    .map((n) => {
      return Number(n);
    });

  return (10 - lastDigitOfSum[lastDigitOfSum.length - 1]) === Number(pin[0]);
};
