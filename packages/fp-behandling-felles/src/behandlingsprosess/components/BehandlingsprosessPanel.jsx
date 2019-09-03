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
  punkter,
  selectedBehandlingspunkt,
  children,
}) => (
  <Panel className={styles.container}>
    {punkter.map((bp) => (
      <BehandlingspunktIcon
        {...bp}
        key={bp.navn}
      />
    ))}
    <>
      {selectedBehandlingspunkt
          && children}
    </>
  </Panel>
);

BehandlingsprosessPanel.propTypes = {
  punkter: PropTypes.arrayOf(BehandlingspunktIcon).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  children: PropTypes.element,
};

BehandlingsprosessPanel.defaultProps = {
  selectedBehandlingspunkt: undefined,
  children: undefined,
};

export default BehandlingsprosessPanel;
