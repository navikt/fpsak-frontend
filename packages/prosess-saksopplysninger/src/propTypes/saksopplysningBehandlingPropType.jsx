import PropTypes from 'prop-types';

const saksopplysningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingHenlagt: PropTypes.bool.isRequired,
});

export default saksopplysningBehandlingPropType;
