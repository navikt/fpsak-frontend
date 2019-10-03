import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const soknadsfristVilkarVilkarPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
  vilkarType: kodeverkObjektPropType.isRequired,
});

export default soknadsfristVilkarVilkarPropType;
