import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { behandlingIListePropType } from '@fpsak-frontend/prop-types';
import BehandlingPickerItem from './BehandlingPickerItem';

import styles from './behandlingPicker.less';

const sortBehandlinger = (behandlinger, selectedBehandlingId) => {
  const selected = behandlinger.filter(b => b.id === selectedBehandlingId);
  const other = behandlinger
    .filter(b => b.id !== selectedBehandlingId)
    .sort((b1, b2) => moment(b2.opprettet).diff(moment(b1.opprettet)));
  return [...selected, ...other];
};

const renderListItems = (behandlinger, saksnummer, behandlingId, showAll, toggleShowAll) => (
  sortBehandlinger(behandlinger, behandlingId)
    .map(behandling => (
      <li key={behandling.id}>
        <BehandlingPickerItem
          onlyOneBehandling={behandlinger.length === 1}
          behandling={behandling}
          saksnummer={saksnummer}
          isActive={behandling.id === behandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
        />
      </li>
    ))
);

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker = ({
  noExistingBehandlinger,
  behandlinger,
  saksnummer,
  behandlingId,
  showAll,
  toggleShowAll,
}) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && <Normaltekst><FormattedMessage id="BehandlingList.ZeroBehandlinger" /></Normaltekst>}
    {!noExistingBehandlinger && renderListItems(behandlinger, saksnummer, behandlingId, showAll, toggleShowAll)}
  </ul>
);

BehandlingPicker.propTypes = {
  behandlinger: PropTypes.arrayOf(behandlingIListePropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  saksnummer: PropTypes.number.isRequired,
  behandlingId: PropTypes.number,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
};

BehandlingPicker.defaultProps = {
  behandlingId: null,
};

export default BehandlingPicker;
