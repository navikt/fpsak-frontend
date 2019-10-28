import PropTypes from 'prop-types';

import arbeidsforholdPropType from './arbeidsforholdPropType';

const fodselOgTilretteleggingPropType = PropTypes.shape({
  termindato: PropTypes.string.isRequired,
  fødselsdato: PropTypes.string,
  arbeidsforholdListe: PropTypes.arrayOf(arbeidsforholdPropType).isRequired,
});

export default fodselOgTilretteleggingPropType;
