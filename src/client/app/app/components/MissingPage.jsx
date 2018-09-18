import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { missingPageContainer } from './missingPage.less';

/**
 * MissingPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const MissingPage = () => (
  <div className={missingPageContainer}>
    <FormattedMessage id="MissingPage.PageIsMissing" />
    <br />
    <Link to="/"><FormattedMessage id="MissingPage.Home" /></Link>
  </div>
);

export default MissingPage;
