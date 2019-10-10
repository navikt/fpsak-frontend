import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const omsorgOgForeldreInntektArbeidYtelsePropType = PropTypes.shape({
  innvilgetRelatertTilgrensendeYtelserForAnnenForelder: PropTypes.arrayOf(PropTypes.shape({
    relatertYtelseType: PropTypes.string,
    tilgrensendeYtelserListe: PropTypes.arrayOf(PropTypes.shape({
      status: kodeverkObjektPropType,
      periodeFraDato: PropTypes.string,
      relatertYtelseType: kodeverkObjektPropType,
    })),
  })).isRequired,
});

export default omsorgOgForeldreInntektArbeidYtelsePropType;
