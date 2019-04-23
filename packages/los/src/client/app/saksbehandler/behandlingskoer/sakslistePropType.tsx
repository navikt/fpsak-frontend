import PropTypes from 'prop-types';

import kodeverkPropType from 'kodeverk/kodeverkPropType';

const sakslistePropType = PropTypes.shape({
  sakslisteId: PropTypes.number.isRequired,
  navn: PropTypes.string.isRequired,
  behandlingTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  fagsakYtelseTyper: PropTypes.arrayOf(kodeverkPropType).isRequired,
  andreKriterier: PropTypes.arrayOf(PropTypes.shape({
    andreKriterierType: kodeverkPropType,
    inkluder: PropTypes.bool.isRequired,
  })),
  sortering: PropTypes.shape({
    sorteringType: kodeverkPropType.isRequired,
    fomDager: PropTypes.number,
    tomDager: PropTypes.number,
    fomDato: PropTypes.string,
    tomDato: PropTypes.string,
    erDynamiskPeriode: PropTypes.bool.isRequired,
  }),
});

export default sakslistePropType;
