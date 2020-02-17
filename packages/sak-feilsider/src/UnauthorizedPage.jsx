import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import ErrorPageWrapper from './components/ErrorPageWrapper';

/**
 * UnauthorizedPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UnauthorizedPage = () => (
  <ErrorPageWrapper titleCode="UnauthorizedPage.Header">
    <Link to="/"><FormattedMessage id="UnauthorizedPage.LinkText" /></Link>
    <br />
  </ErrorPageWrapper>
);

export default UnauthorizedPage;
