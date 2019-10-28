import PropTypes from 'prop-types';

const adopsjonPersonopplysningerPropType = PropTypes.shape({
  barnSoktFor: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default adopsjonPersonopplysningerPropType;
