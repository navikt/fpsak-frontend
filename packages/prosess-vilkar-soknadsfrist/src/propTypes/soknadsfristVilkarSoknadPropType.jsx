import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const soknadsfristVilkarSoknadPropType = PropTypes.shape({
  soknadType: kodeverkObjektPropType.isRequired,
  mottattDato: PropTypes.string.isRequired,
  begrunnelseForSenInnsending: PropTypes.string,
  fodselsdatoer: PropTypes.shape(),
  omsorgsovertakelseDato: PropTypes.string,
});

export default soknadsfristVilkarSoknadPropType;
