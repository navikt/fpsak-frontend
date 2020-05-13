export const fodselsnummerPattern = /^\d{11}$/;

const sum = (fodselsnummer, faktors) => {
  let s = 0;
  for (let i = 0; i < faktors.length; i += 1) {
    s += parseInt(fodselsnummer[i], 10) * faktors[i];
  }
  return s;
};

export const isValidFodselsnummer = (input) => {
  const fodselsnummer = `${input}`;
  if (!fodselsnummerPattern.test(fodselsnummer)) {
    return false;
  }
  let factors = [3, 7, 6, 1, 8, 9, 4, 5, 2];
  let checksumOne = 11 - (sum(fodselsnummer, factors) % 11);
  if (checksumOne === 11) {
    checksumOne = 0;
  }
  factors = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let checksumTwo = 11 - (sum(fodselsnummer, factors) % 11);
  if (checksumTwo === 11) {
    checksumTwo = 0;
  }
  return checksumOne === parseInt(fodselsnummer[9], 10) && checksumTwo === parseInt(fodselsnummer[10], 10);
};
