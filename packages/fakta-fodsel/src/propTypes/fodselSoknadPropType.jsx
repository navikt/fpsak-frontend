import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const fodselSoknadPropType = PropTypes.shape({
  fodselsdatoer: PropTypes.shape().isRequired,
  termindato: PropTypes.string,
  antallBarn: PropTypes.number.isRequired,
  utstedtdato: PropTypes.string,
  soknadType: kodeverkObjektPropType.isRequired,
});

export default fodselSoknadPropType;
