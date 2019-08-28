import React from 'react';
import PropTypes from 'prop-types';
import Panel from 'nav-frontend-paneler';

import BehandlingspunktIcon from './BehandlingspunktIcon';

import styles from './behandlingsprosessPanel.less';

/*
 * BehandlingsprosessPanel
 *
 * Presentasjonskomponent. Viser behandlingspunkt-ikonene som lar den NAV-ansatte velge behandingspunkt.
 * I tillegg vises navn og merknad knyttet til behandlingspunktet.
 */
const BehandlingsprosessPanel = ({
  behandlingspunkter,
  selectedBehandlingspunkt,
  selectBehandlingspunktCallback,
  isSelectedBehandlingHenlagt,
  findBehandlingsprosessIcon,
  getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus,
  children,
}) => (
  <Panel className={styles.container}>
    { behandlingspunkter.map((bp) => (
      <BehandlingspunktIcon
        key={bp}
        behandlingspunkt={bp}
        isSelectedBehandlingspunkt={bp === selectedBehandlingspunkt}
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        selectBehandlingspunktCallback={selectBehandlingspunktCallback}
        findBehandlingsprosessIcon={findBehandlingsprosessIcon}
        getBehandlingspunkterStatus={getBehandlingspunkterStatus}
        getBehandlingspunkterTitleCodes={getBehandlingspunkterTitleCodes}
        getAksjonspunkterOpenStatus={getAksjonspunkterOpenStatus}
      />
    ))}
    <>
      {selectedBehandlingspunkt
          && children}
    </>
  </Panel>
);

BehandlingsprosessPanel.propTypes = {
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  selectBehandlingspunktCallback: PropTypes.func.isRequired,
  findBehandlingsprosessIcon: PropTypes.func.isRequired,
  getBehandlingspunkterStatus: PropTypes.func.isRequired,
  getBehandlingspunkterTitleCodes: PropTypes.func.isRequired,
  getAksjonspunkterOpenStatus: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool,
  children: PropTypes.element,
};

BehandlingsprosessPanel.defaultProps = {
  selectedBehandlingspunkt: undefined,
  isSelectedBehandlingHenlagt: false,
  children: undefined,
};

export default BehandlingsprosessPanel;
