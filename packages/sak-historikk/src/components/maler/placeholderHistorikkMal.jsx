import React from 'react';
import PropTypes from 'prop-types';

const PlaceholderHistorikkMal = ({ tekst }) => <div>{JSON.stringify(tekst)}</div>;

PlaceholderHistorikkMal.propTypes = {
  tekst: PropTypes.shape().isRequired,
};

export default PlaceholderHistorikkMal;
