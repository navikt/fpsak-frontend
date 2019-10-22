import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const opptjeningVilkarOpptjeningPropType = PropTypes.shape({
  fastsattOpptjening: PropTypes.shape({
    opptjeningperiode: PropTypes.shape({
      måneder: PropTypes.number.isRequired,
      dager: PropTypes.number.isRequired,
    }),
    fastsattOpptjeningAktivitetList: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string.isRequired,
      klasse: kodeverkObjektPropType.isRequired,
    })).isRequired,
    opptjeningFom: PropTypes.string.isRequired,
    opptjeningTom: PropTypes.string.isRequired,
  }),
});

export default opptjeningVilkarOpptjeningPropType;
