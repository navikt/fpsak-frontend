import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const sokersOpplysningspliktSoknadPropType = PropTypes.shape({
  manglendeVedlegg: PropTypes.arrayOf(PropTypes.shape({
    dokumentType: kodeverkObjektPropType.isRequired,
    arbeidsgiver: PropTypes.shape({
      organisasjonsnummer: PropTypes.string.isRequired,
      fødselsdato: PropTypes.string,
      navn: PropTypes.string.isRequired,
    }),
  }).isRequired),
});

export default sokersOpplysningspliktSoknadPropType;
