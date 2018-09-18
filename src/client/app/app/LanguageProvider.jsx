import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { IntlProvider, addLocaleData } from 'react-intl';
import nb from 'react-intl/locale-data/nb';

import ElementWrapper from 'sharedComponents/ElementWrapper';
import { getRestApiData } from 'data/duck';
import { FpsakApi } from 'data/fpsakApi';

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
  nbMessages: getRestApiData(FpsakApi.LANGUAGE_FILE)(state),
});

export default connect(mapStateToProps)(LanguageProvider);
