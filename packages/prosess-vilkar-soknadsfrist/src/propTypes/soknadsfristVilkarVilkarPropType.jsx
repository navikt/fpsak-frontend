import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const soknadsfristVilkarAksjonspunkterPropType = PropTypes.shape({
  vilkarType: kodeverkObjektPropType.isRequired,
  merknadParametere: PropTypes.shape({
    antallDagerSoeknadLevertForSent: PropTypes.string,
  }),
});

export default soknadsfristVilkarAksjonspunkterPropType;
