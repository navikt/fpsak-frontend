import React, { FunctionComponent } from 'react';
import { NavLink } from 'react-router-dom';

import { Behandling, Kodeverk, KodeverkMedNavn } from '@fpsak-frontend/types';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';

import styles from './behandlingPickerItem.less';

const getContentProps = (behandling, getKodeverkFn) => ({
  behandlingId: behandling.id,
  behandlingTypeNavn: getKodeverkFn(behandling.type, behandling.type).navn,
  behandlingTypeKode: behandling.type.kode,
  førsteÅrsak: behandling.førsteÅrsak,
  behandlendeEnhetId: behandling.behandlendeEnhetId,
  behandlendeEnhetNavn: behandling.behandlendeEnhetNavn,
  opprettetDato: behandling.opprettet,
  avsluttetDato: behandling.avsluttet,
  behandlingsstatus: getKodeverkFn(behandling.status, behandling.type).navn,
  erGjeldendeVedtak: behandling.gjeldendeVedtak,
  behandlingsresultatTypeNavn: behandling.behandlingsresultat ? getKodeverkFn(behandling.behandlingsresultat.type, behandling.type).navn : undefined,
  behandlingsresultatTypeKode: behandling.behandlingsresultat ? behandling.behandlingsresultat.type.kode : undefined,
});

const renderItemContent = (behandling, getKodeverkFn, withChevronDown = false, withChevronUp = false) => (
  <BehandlingPickerItemContent
    withChevronDown={withChevronDown}
    withChevronUp={withChevronUp}
    {...getContentProps(behandling, getKodeverkFn)}
  />
);

const renderToggleShowAllButton = (toggleShowAll, behandling, showAll, getKodeverkFn) => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverkFn, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (getBehandlingLocation, behandling, isActive, toggleShowAll, showAll, getKodeverkFn) => (
  <NavLink
    className={styles.linkToBehandling}
    to={getBehandlingLocation(behandling.id)}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling, getKodeverkFn, false, showAll && isActive)}
  </NavLink>
);

interface OwnProps {
  onlyOneBehandling: boolean;
  behandling: Behandling;
  getBehandlingLocation: (behandlingId: number) => void;
  isActive: boolean;
  showAll: boolean;
  toggleShowAll: () => void;
  getKodeverkFn: (kodeverk: Kodeverk, behandlingType?: Kodeverk) => KodeverkMedNavn;
}

const BehandlingPickerItem: FunctionComponent<OwnProps> = ({
  onlyOneBehandling,
  behandling,
  getBehandlingLocation,
  isActive,
  showAll,
  toggleShowAll,
  getKodeverkFn,
}) => {
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling, getKodeverkFn);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(getBehandlingLocation, behandling, isActive, toggleShowAll, showAll, getKodeverkFn);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll, getKodeverkFn);
  }
  return null;
};

export default BehandlingPickerItem;
