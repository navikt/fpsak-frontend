import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const adopsjonSoknadPropType = PropTypes.shape({
  fodselsdatoer: PropTypes.shape(),
  termindato: PropTypes.string,
  antallBarn: PropTypes.number.isRequired,
  utstedtdato: PropTypes.string,
  soknadType: kodeverkObjektPropType.isRequired,
});

export default adopsjonSoknadPropType;
