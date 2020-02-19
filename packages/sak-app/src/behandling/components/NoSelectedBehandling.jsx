import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import styles from './noSelectedBehandling.less';

const getMessage = (numBehandlinger) => (numBehandlinger === 0 ? 'NoSelectedBehandling.ZeroBehandlinger' : 'FagsakGrid.PleaseSelectBehandling');

/**
 * NoSelectedBehandling
 *
 * Presentasjonskomponent. Vises når ingen behandling er valgt på en fagsak
 */
const NoSelectedBehandling = ({ numBehandlinger }) => (
  <div className={styles.noSelectedBehandlingPanel}>
    <AlertStripeInfo>
      <Normaltekst>
        <FormattedMessage id={getMessage(numBehandlinger)} />
      </Normaltekst>
    </AlertStripeInfo>
  </div>
);

NoSelectedBehandling.propTypes = {
  numBehandlinger: PropTypes.number.isRequired,
};

export default NoSelectedBehandling;
