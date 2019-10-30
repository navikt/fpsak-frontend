import PropTypes from 'prop-types';

const tilbakekrevingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default tilbakekrevingBehandlingPropType;
