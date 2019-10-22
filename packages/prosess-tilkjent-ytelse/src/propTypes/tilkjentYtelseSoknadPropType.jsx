import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const tilkjentYtelseSoknadPropType = PropTypes.shape({
  mottattDato: PropTypes.string.isRequired,
  soknadType: kodeverkObjektPropType.isRequired,
  omsorgsovertakelseDato: PropTypes.string,
  fodselsdatoer: PropTypes.shape(),
  adopsjonFodelsedatoer: PropTypes.shape(),
  termindato: PropTypes.string,
});

export default tilkjentYtelseSoknadPropType;
