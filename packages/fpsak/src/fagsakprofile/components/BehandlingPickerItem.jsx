import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { injectKodeverk, pathToBehandling, getLocationWithDefaultBehandlingspunktAndFakta } from '@fpsak-frontend/fp-felles';
import { behandlingIListePropType } from '@fpsak-frontend/prop-types';

import { getAlleKodeverk } from 'kodeverk/duck';
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
});

const renderItemContent = (behandling, getKodeverknavn, withChevronDown = false, withChevronUp = false) => (
  <BehandlingPickerItemContent withChevronDown={withChevronDown} withChevronUp={withChevronUp} {...getContentProps(behandling, getKodeverknavn)} />
);

const renderToggleShowAllButton = (toggleShowAll, behandling, showAll, getKodeverknavn) => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, getKodeverknavn, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (saksnummer, behandling, toggleShowAll, getKodeverknavn) => (
  <NavLink
    className={styles.linkToBehandling}
    to={getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, behandling.id) })}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling, getKodeverknavn)}
  </NavLink>
);

export const BehandlingPickerItem = ({
  onlyOneBehandling,
  behandling,
  saksnummer,
  isActive,
  showAll,
  toggleShowAll,
  getKodeverknavn,
}) => {
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling, getKodeverknavn);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(saksnummer, behandling, toggleShowAll, getKodeverknavn);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll, getKodeverknavn);
  }
  return null;
};

BehandlingPickerItem.propTypes = {
  onlyOneBehandling: PropTypes.bool.isRequired,
  behandling: behandlingIListePropType.isRequired,
  saksnummer: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

export default injectKodeverk(getAlleKodeverk)(BehandlingPickerItem);
