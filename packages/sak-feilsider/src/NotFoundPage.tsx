import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import ErrorPageWrapper from './components/ErrorPageWrapper';

/**
 * NotFoundPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const NotFoundPage = () => (
  <ErrorPageWrapper titleCode="NotFoundPage.Header">
    <Link to="/"><FormattedMessage id="NotFoundPage.LinkText" /></Link>
  </ErrorPageWrapper>
);

export default NotFoundPage;
