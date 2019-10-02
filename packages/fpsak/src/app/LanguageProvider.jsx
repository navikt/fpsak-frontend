import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import fpsakApi from 'data/fpsakApi';
import { CustomLanguageProvider } from '@fpsak-frontend/fp-felles';


/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
export const LanguageProvider = ({ nbMessages, children }) => (
  <CustomLanguageProvider messages={nbMessages}>
    {children}
  </CustomLanguageProvider>
);

LanguageProvider.propTypes = {
  nbMessages: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  nbMessages: fpsakApi.LANGUAGE_FILE.getRestApiData()(state),
});

export default connect(mapStateToProps)(LanguageProvider);
