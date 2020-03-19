import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { getKodeverknavnFn } from '@fpsak-frontend/utils';

import behandlingVelgerBehandlingPropType from '../propTypes/behandlingVelgerBehandlingPropType';
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

const BehandlingPickerItem = ({
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

BehandlingPickerItem.propTypes = {
  onlyOneBehandling: PropTypes.bool.isRequired,
  behandling: behandlingVelgerBehandlingPropType.isRequired,
  getBehandlingLocation: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default BehandlingPickerItem;
