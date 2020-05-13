import React, { FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import styles from './noSelectedBehandling.less';

const getMessage = (numBehandlinger) => (numBehandlinger === 0 ? 'NoSelectedBehandling.ZeroBehandlinger' : 'FagsakGrid.PleaseSelectBehandling');

interface OwnProps {
  numBehandlinger: number;
}

/**
 * NoSelectedBehandling
 *
 * Presentasjonskomponent. Vises når ingen behandling er valgt på en fagsak
 */
const NoSelectedBehandling: FunctionComponent<OwnProps> = ({
  numBehandlinger,
}) => (
  <div className={styles.noSelectedBehandlingPanel}>
    <AlertStripeInfo>
      <Normaltekst>
        <FormattedMessage id={getMessage(numBehandlinger)} />
      </Normaltekst>
    </AlertStripeInfo>
  </div>
);

export default NoSelectedBehandling;
