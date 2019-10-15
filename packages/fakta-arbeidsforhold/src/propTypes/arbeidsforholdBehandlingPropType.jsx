import PropTypes from 'prop-types';

const arbeidsforholdBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default arbeidsforholdBehandlingPropType;
