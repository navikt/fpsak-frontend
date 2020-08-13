import React, { FunctionComponent, ReactNode } from 'react';
import { IntlProvider } from 'react-intl';

import { FpsakApiKeys, useGlobalStateRestApiData } from '../data/fpsakApi';

interface OwnProps {
  children: ReactNode;
}

/**
 * LanguageProvider
 *
 * Container komponent. Har ansvar for å hente språkfilen.
 */
const LanguageProvider: FunctionComponent<OwnProps> = ({
  children,
}) => {
  const nbMessages = useGlobalStateRestApiData<any>(FpsakApiKeys.LANGUAGE_FILE);

  return (
    <IntlProvider locale="nb-NO" messages={nbMessages}>
      {children}
    </IntlProvider>
  );
};

export default LanguageProvider;
