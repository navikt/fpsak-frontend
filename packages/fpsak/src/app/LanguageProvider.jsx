import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';


import { ElementWrapper } from '@fpsak-frontend/shared-components';
import fpsakApi from 'data/fpsakApi';


/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
export const LanguageProvider = ({ nbMessages, children }) => (
  <IntlProvider locale="nb-NO" messages={nbMessages}>
    <ElementWrapper>
      {children}
    </ElementWrapper>
  </IntlProvider>
);

LanguageProvider.propTypes = {
  nbMessages: PropTypes.shape().isRequired,
  children: PropTypes.node.isRequired,
};

const mapStateToProps = (state) => ({
  nbMessages: fpsakApi.LANGUAGE_FILE.getRestApiData()(state),
});

export default connect(mapStateToProps)(LanguageProvider);
