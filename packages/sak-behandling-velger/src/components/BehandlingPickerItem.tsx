import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { Behandling, KodeverkMedNavn } from '@fpsak-frontend/types';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';

import styles from './behandlingPickerItem.less';

const getContentProps = (behandling, getKodeverknavn) => ({
  behandlingId: behandling.id,
  behandlingTypeNavn: getKodeverknavn(behandling.type),
  behandlingTypeKode: behandling.type.kode,
  førsteÅrsak: behandling.førsteÅrsak,
  behandlendeEnhetId: behandling.behandlendeEnhetId,
  behandlendeEnhetNavn: behandling.behandlendeEnhetNavn,
  opprettetDato: behandling.opprettet,
  avsluttetDato: behandling.avsluttet,
  behandlingsstatus: getKodeverknavn(behandling.status),
  erGjeldendeVedtak: behandling.gjeldendeVedtak,
  behandlingsresultatTypeNavn: behandling.behandlingsresultat ? getKodeverknavn(behandling.behandlingsresultat.type) : undefined,
  behandlingsresultatTypeKode: behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined,
});

const renderItemContent = (behandling, getKodeverknavn, withChevronDown = false, withChevronUp = false) => (
  <BehandlingPickerItemContent
    withChevronDown={withChevronDown}
    withChevronUp={withChevronUp}
    {...getContentProps(behandling, getKodeverknavn)}
  />
);

const renderToggleShowAllButton = (toggleShowAll, behandling, showAll, getKodeverknavn) => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverknavn, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (getBehandlingLocation, behandling, isActive, toggleShowAll, showAll, getKodeverknavn) => (
  <NavLink
    className={styles.linkToBehandling}
    to={getBehandlingLocation(behandling.id)}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling, getKodeverknavn, false, showAll && isActive)}
  </NavLink>
);

interface OwnProps {
  onlyOneBehandling: boolean;
  behandling: Behandling;
  getBehandlingLocation: (behandlingId: number) => void;
  isActive: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
  alleKodeverk: {[key: string]: [KodeverkMedNavn]};
}

const BehandlingPickerItem: FunctionComponent<OwnProps> = ({
  onlyOneBehandling,
  behandling,
  getBehandlingLocation,
  isActive,
  showAll,
  toggleShowAll,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling, getKodeverknavn);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(getBehandlingLocation, behandling, isActive, toggleShowAll, showAll, getKodeverknavn);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll, getKodeverknavn);
  }
  return null;
};

export default BehandlingPickerItem;
