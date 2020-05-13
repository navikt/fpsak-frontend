export const formatCurrencyWithKr = (value) => {
  const formattedValue = Number(value).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
  return (`${formattedValue} kr`);
};

export const formatCurrencyNoKr = (value) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  // Fjerner mellomrom i tilfelle vi får inn tall med det
  const newVal = value.toString().replace(/\s/g, '');
  if (Number.isNaN(newVal)) {
    return undefined;
  }
  return Number(Math.round(newVal)).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
};

export const removeSpacesFromNumber = (input) => {
  if (!input || input === parseInt(input, 10)) {
    return input;
  }
  const parsedValue = parseInt(input.replace(/\s/g, ''), 10);
  return Number.isNaN(parsedValue) ? input : parsedValue;
};

export const parseCurrencyInput = (input) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : formatCurrencyNoKr(parsedValue);
};
