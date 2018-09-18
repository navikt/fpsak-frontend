import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';

import { pathToBehandling, getLocationWithDefaultBehandlingspunktAndFakta } from 'app/paths';
import behandlingPropType from 'behandling/proptypes/behandlingPropType';

import BehandlingPickerItemContent from './BehandlingPickerItemContent';

import styles from './behandlingPickerItem.less';


const getContentProps = behandling => ({
  behandlingId: behandling.id,
  behandlingType: behandling.type.navn,
  behandlendeEnhetId: behandling.behandlendeEnhetId,
  behandlendeEnhetNavn: behandling.behandlendeEnhetNavn,
  opprettetDato: behandling.opprettet,
  avsluttetDato: behandling.avsluttet,
  behandlingsstatus: behandling.status.navn,
});

const renderItemContent = (behandling, withChevronDown = false, withChevronUp = false) => (
  <BehandlingPickerItemContent withChevronDown={withChevronDown} withChevronUp={withChevronUp} {...getContentProps(behandling)} />
);

const renderToggleShowAllButton = (toggleShowAll, behandling, showAll) => (
  <button type="button" className={styles.toggleShowAllButton} onClick={toggleShowAll}>
    {renderItemContent(behandling, !showAll, showAll)}
  </button>
);

const renderLinkToBehandling = (saksnummer, behandling, toggleShowAll) => (
  <NavLink
    className={styles.linkToBehandling}
    to={getLocationWithDefaultBehandlingspunktAndFakta({ pathname: pathToBehandling(saksnummer, behandling.id) })}
    onClick={toggleShowAll}
  >
    {renderItemContent(behandling)}
  </NavLink>
);

const BehandlingPickerItem = ({
  onlyOneBehandling,
  behandling,
  saksnummer,
  isActive,
  showAll,
  toggleShowAll,
}) => {
  if (onlyOneBehandling && isActive) {
    return renderItemContent(behandling);
  }
  if (onlyOneBehandling || showAll) {
    return renderLinkToBehandling(saksnummer, behandling, toggleShowAll);
  }
  if (isActive) {
    return renderToggleShowAllButton(toggleShowAll, behandling, showAll);
  }
  return null;
};

BehandlingPickerItem.propTypes = {
  onlyOneBehandling: PropTypes.bool.isRequired,
  behandling: behandlingPropType.isRequired,
  saksnummer: PropTypes.number.isRequired,
  isActive: PropTypes.bool.isRequired,
  showAll: PropTypes.bool.isRequired,
  toggleShowAll: PropTypes.func.isRequired,
};

export default BehandlingPickerItem;
