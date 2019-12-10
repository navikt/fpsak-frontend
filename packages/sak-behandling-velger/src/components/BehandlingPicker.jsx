import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import behandlingVelgerBehandlingPropType from '../propTypes/behandlingVelgerBehandlingPropType';
import BehandlingPickerItem from './BehandlingPickerItem';

import styles from './behandlingPicker.less';

export const sortBehandlinger = (behandlinger) => behandlinger.sort((b1, b2) => {
  if (b1.avsluttet && !b2.avsluttet) {
    return 1;
  } if (!b1.avsluttet && b2.avsluttet) {
    return -1;
  } if (b1.avsluttet && b2.avsluttet) {
    return moment(b2.avsluttet).diff(moment(b1.avsluttet));
  }
  return moment(b2.opprettet).diff(moment(b1.opprettet));
});

const renderListItems = (behandlinger, saksnummer, behandlingId, showAll, toggleShowAll, alleKodeverk) => (
  sortBehandlinger(behandlinger)
    .map((behandling) => (
      <li key={behandling.id}>
        <BehandlingPickerItem
          onlyOneBehandling={behandlinger.length === 1}
          behandling={behandling}
          saksnummer={saksnummer}
          isActive={behandling.id === behandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          alleKodeverk={alleKodeverk}
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
  alleKodeverk,
}) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && <Normaltekst><FormattedMessage id="BehandlingList.ZeroBehandlinger" /></Normaltekst>}
    {!noExistingBehandlinger && renderListItems(behandlinger, saksnummer, behandlingId, showAll, toggleShowAll, alleKodeverk)}
  </ul>
);

BehandlingPicker.propTypes = {
  behandlinger: PropTypes.arrayOf(behandlingVelgerBehandlingPropType).isRequired,
  noExistingBehandlinger: PropTypes.bool.isRequired,
  saksnummer: PropTypes.string.isRequired,
  behandlingId: PropTypes.number,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

BehandlingPicker.defaultProps = {
  behandlingId: null,
};

export default BehandlingPicker;
