import React, { FunctionComponent } from 'react';
import moment from 'moment';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { Behandling, KodeverkMedNavn } from '@fpsak-frontend/types';

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

const renderListItems = (behandlinger, getBehandlingLocation, behandlingId, showAll, toggleShowAll, alleKodeverk) => (
  sortBehandlinger(behandlinger)
    .filter((behandling) => showAll || behandling.id === behandlingId)
    .map((behandling) => (
      <li key={behandling.id}>
        <BehandlingPickerItem
          onlyOneBehandling={behandlinger.length === 1}
          behandling={behandling}
          getBehandlingLocation={getBehandlingLocation}
          isActive={behandling.id === behandlingId}
          showAll={showAll}
          toggleShowAll={toggleShowAll}
          alleKodeverk={alleKodeverk}
        />
      </li>
    ))
);

interface OwnProps {
  behandlinger: Behandling[];
  getBehandlingLocation: (behandlingId: number) => void;
  noExistingBehandlinger: boolean;
  behandlingId?: number;
  showAll: boolean;
  toggleShowAll: () => void;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
}

/**
 * BehandlingPicker
 *
 * Viser behandlinger knyttet til fagsak,
 */
const BehandlingPicker: FunctionComponent<OwnProps> = ({
  noExistingBehandlinger,
  behandlinger,
  getBehandlingLocation,
  behandlingId,
  showAll,
  toggleShowAll,
  alleKodeverk,
}) => (
  <ul className={styles.behandlingList}>
    {noExistingBehandlinger && <Normaltekst><FormattedMessage id="BehandlingList.ZeroBehandlinger" /></Normaltekst>}
    {!noExistingBehandlinger && renderListItems(behandlinger, getBehandlingLocation, behandlingId, showAll, toggleShowAll, alleKodeverk)}
  </ul>
);

export default BehandlingPicker;
