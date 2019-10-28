import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const arbeidsforholdPropType = PropTypes.shape({
  tilretteleggingId: PropTypes.number.isRequired,
  tilretteleggingBehovFom: PropTypes.string.isRequired,
  tilretteleggingDatoer: PropTypes.arrayOf(PropTypes.shape({
    fom: PropTypes.string.isRequired,
    type: kodeverkObjektPropType.isRequired,
    stillingsprosent: PropTypes.number,
  })).isRequired,
  arbeidsgiverNavn: PropTypes.string.isRequired,
  arbeidsgiverIdent: PropTypes.string,
  opplysningerOmRisiko: PropTypes.string,
  opplysningerOmTilrettelegging: PropTypes.string,
  internArbeidsforholdReferanse: PropTypes.string,
  eksternArbeidsforholdReferanse: PropTypes.string,
  skalBrukes: PropTypes.bool.isRequired,
  begrunnelse: PropTypes.string,
});

export default arbeidsforholdPropType;
