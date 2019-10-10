import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const omsorgOgForeldreSoknadPropType = PropTypes.shape({
  antallBarn: PropTypes.number.isRequired,
  soknadType: kodeverkObjektPropType.isRequired,
  fodselsdatoer: PropTypes.shape(),
  adopsjonFodelsedatoer: PropTypes.shape(),
  farSokerType: kodeverkObjektPropType,
  omsorgsovertakelseDato: PropTypes.string,
  barnetsAnkomstTilNorgeDato: PropTypes.string,
  utstedtdato: PropTypes.string,
  termindato: PropTypes.string,
});

export default omsorgOgForeldreSoknadPropType;
