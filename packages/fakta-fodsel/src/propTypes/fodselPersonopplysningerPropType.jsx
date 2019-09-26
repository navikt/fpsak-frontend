import PropTypes from 'prop-types';

const fodselPersonopplysningerPropType = PropTypes.shape({
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default fodselPersonopplysningerPropType;
