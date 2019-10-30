import PropTypes from 'prop-types';

const vilkarsvurderingPropType = PropTypes.shape({
  vilkarsVurdertePerioder: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default vilkarsvurderingPropType;
