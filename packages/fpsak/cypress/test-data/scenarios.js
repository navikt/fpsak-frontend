
const enkelKvinneSok = require('./person-sok/enkel-kvinne');
const enkelMannSok = require('./person-sok/enkel-mann');
const enkelSoknad = require('./foreldrepengesoknad-sendviafordeling/enkel-soknad');

exports.morSokerAlene = {
  hodedsokerSok:enkelKvinneSok,
  hovedsoknad: enkelSoknad,
};

exports.toForeldre = {
  hodedsokerSok:enkelKvinneSok,
  hovedsoknad: enkelSoknad,
  annenforelderSok: enkelMannSok,
  annensoknad: "",
};
