import PropTypes from 'prop-types';

const ankeResultatBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default ankeResultatBehandlingPropType;
