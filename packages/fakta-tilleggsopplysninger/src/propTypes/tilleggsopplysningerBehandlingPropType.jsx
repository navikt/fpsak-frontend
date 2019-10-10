import PropTypes from 'prop-types';

const tilleggsopplysningerBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default tilleggsopplysningerBehandlingPropType;
