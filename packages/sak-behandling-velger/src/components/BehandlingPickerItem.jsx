import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { getLocationWithDefaultBehandlingspunktAndFakta, pathToBehandling, getKodeverknavnFn } from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

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
});

const renderItemContent = (behandling, getKodeverknavn, isSelected = false, withChevronDown = false, withChevronUp = false) => (
  <BehandlingPickerItemContent
    withChevronDown={withChevronDown}
    withChevronUp={withChevronUp}
    isSelected={isSelected}
    {...getContentProps(behandling, getKodeverknavn)}
  />
);

const renderToggleShowAllButton = (toggleShowAll, behandling, isActive, showAll, getKodeverknavn) => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverknavn, isActive, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (saksnummer, behandling, isActive, toggleShowAll, showAll, getKodeverknavn) => (
  <NavLink
    className={styles.linkToBehandling}
    to={getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, behandling.id) })}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling, getKodeverknavn, isActive, false, showAll && isActive)}
  </NavLink>
);

const BehandlingPickerItem = ({
  onlyOneBehandling,
  behandling,
  saksnummer,
  isActive,
  showAll,
  toggleShowAll,
  alleKodeverk,
}) => {
  const getKodeverknavn = getKodeverknavnFn(alleKodeverk, kodeverkTyper);
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling, getKodeverknavn, isActive);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(saksnummer, behandling, isActive, toggleShowAll, showAll, getKodeverknavn);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, isActive, showAll, getKodeverknavn);
  }
  return null;
};

BehandlingPickerItem.propTypes = {
  onlyOneBehandling: PropTypes.bool.isRequired,
  behandling: behandlingVelgerBehandlingPropType.isRequired,
  saksnummer: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

export default BehandlingPickerItem;
