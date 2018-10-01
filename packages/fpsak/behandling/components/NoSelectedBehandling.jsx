import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import styles from './noSelectedBehandling.less';

const getMessage = numBehandlinger => (numBehandlinger === 0 ? 'BehandlingList.ZeroBehandlinger' : 'FagsakGrid.PleaseSelectBehandling');

/**
 * NoSelectedBehandling
 *
 * Presentasjonskomponent. Vises når ingen behandling er valgt på en fagsak
 */
const NoSelectedBehandling = ({ numBehandlinger }) => (
  <div className={styles.noSelectedBehandlingPanel}>
    <Normaltekst>
      <FormattedMessage id={getMessage(numBehandlinger)} />
    </Normaltekst>
  </div>
);

NoSelectedBehandling.propTypes = {
  numBehandlinger: PropTypes.number.isRequired,
};

export default NoSelectedBehandling;
