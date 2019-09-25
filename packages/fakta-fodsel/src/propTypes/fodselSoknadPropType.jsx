import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const fodselSoknadPropType = PropTypes.shape({
  fodselsdatoer: PropTypes.arrayOf(PropTypes.string).isRequired,
  termindato: PropTypes.string.isRequired,
  antallBarn: PropTypes.number.isRequired,
  utstedtdato: PropTypes.string.isRequired,
  soknadType: kodeverkObjektPropType.isRequired,
});

export default fodselSoknadPropType;
