import React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { Panel } from 'nav-frontend-paneler';
import { Undertittel, Normaltekst } from 'nav-frontend-typografi';

import styles from './missingPage.less';

/**
 * MissingPage
 *
 * Presentasjonskomponent. Denne komponenten vises når den NAV-ansatte prøver å aksessere en url som ikke finnes.
 * Det blir presentert en generell feilmelding og en lenke som tar NAV-ansatt tilbake til hovedsiden.
 */
const MissingPage = () => (
  <Panel className={styles.container}>
    <Undertittel>
      <FormattedMessage id="MissingPage.PageIsMissing" />
    </Undertittel>
    <Normaltekst>
      <Link to="/">
        <FormattedMessage id="MissingPage.Home" />
      </Link>
    </Normaltekst>
  </Panel>
);

export default MissingPage;
