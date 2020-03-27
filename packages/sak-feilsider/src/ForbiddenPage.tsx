import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Undertittel } from 'nav-frontend-typografi';

import ErrorPageWrapper from './components/ErrorPageWrapper';

/**
 * ForbiddenPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ForbiddenPage = () => (
  <ErrorPageWrapper titleCode="ForbiddenPage.Header">
    <br />
    <a href="/"><FormattedMessage id="ForbiddenPage.LinkText" /></a>
    <br />
    <Undertittel />
  </ErrorPageWrapper>
);

export default ForbiddenPage;
