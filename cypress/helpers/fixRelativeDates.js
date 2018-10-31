function formatDateTime(dateObj) {
  return `${dateObj.toLocaleDateString('nb')} 12:00`;
}

function createDate(startDate, dayDiff) {
  if (typeof startDate === 'string') {
    startDate = new Date(startDate);
  }
  var d = new Date(startDate);
  d.setDate(startDate.getDate() + dayDiff);
  return d;
}

function daysBetweenDates(str1, str2) {
  return Math.floor((Date.parse(str2) - Date.parse(str1)) / 86400000);
}

module.exports = function (input, fodselstidspunkt) {
  let diff = 0;
  if (input.foedsel && input.foedsel.foedselsdato) {
    diff = daysBetweenDates(input.foedsel.foedselsdato, fodselstidspunkt.toISOString());
    input.foedsel.foedselsdato = fodselstidspunkt.toISOString();
  }
  if (input.termin && input.termin.termindato) {
    diff = daysBetweenDates(input.termin.termindato, fodselstidspunkt.toISOString());
    input.termin.termindato = fodselstidspunkt.toISOString();
    input.termin.utstedtdato = createDate(input.termin.utstedtdato, diff);
  }
  if (input.perioder && Array.isArray(input.perioder)) {
    input.perioder.forEach(periode => {
      if (periode.fom) {
        periode.fom = createDate(periode.fom, diff);
      }
      if (periode.tom) {
        periode.tom = createDate(periode.tom, diff);
      }
    });
  }
  return input;
};
