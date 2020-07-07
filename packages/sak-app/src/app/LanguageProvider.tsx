import React, { FunctionComponent, ReactNode } from 'react';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';

import fpsakApi from '../data/fpsakApi';

interface OwnProps {
  nbMessages: any;
  children: ReactNode;
}

/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
export const LanguageProvider: FunctionComponent<OwnProps> = ({
  nbMessages,
  children,
}) => (
  <IntlProvider locale="nb-NO" messages={nbMessages}>
    {children}
  </IntlProvider>
);

const mapStateToProps = (state) => ({
  nbMessages: fpsakApi.LANGUAGE_FILE.getRestApiData()(state),
});

export default connect(mapStateToProps)(LanguageProvider);
