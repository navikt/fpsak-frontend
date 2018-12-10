import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import nb from 'react-intl/locale-data/nb';

import { ElementWrapper } from '@fpsak-frontend/shared-components';
import fpsakApi from 'data/fpsakApi';

addLocaleData(nb);

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

const mapStateToProps = state => ({
  nbMessages: fpsakApi.LANGUAGE_FILE.getRestApiData()(state),
});

export default connect(mapStateToProps)(LanguageProvider);
