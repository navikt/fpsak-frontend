const enkelSoknad = require('../test-data/foreldrepengesoknad-sendviafordeling/enkel-soknad-termin');
const fixRelativeDates = require('./fixRelativeDates');
const birthDate = require('../test-data/dates')['30_DAGER_FREM_I_TID']

const withFixedDates = fixRelativeDates(enkelSoknad, birthDate);

console.log(withFixedDates);
