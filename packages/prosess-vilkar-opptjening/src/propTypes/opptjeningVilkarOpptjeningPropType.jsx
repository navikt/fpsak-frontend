import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

export const fastsattOpptjeningPropType = PropTypes.shape({
  opptjeningperiode: PropTypes.shape({
    måneder: PropTypes.number.isRequired,
    dager: PropTypes.number.isRequired,
  }),
  fastsattOpptjeningAktivitetList: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    fom: PropTypes.string.isRequired,
    tom: PropTypes.string.isRequired,
    klasse: kodeverkObjektPropType.isRequired,
  })).isRequired,
  opptjeningFom: PropTypes.string.isRequired,
  opptjeningTom: PropTypes.string.isRequired,
});

const opptjeningVilkarOpptjeningPropType = PropTypes.shape({
  fastsattOpptjening: fastsattOpptjeningPropType,
});

export default opptjeningVilkarOpptjeningPropType;
