import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Panel from 'nav-frontend-paneler';

import { getBehandlingHenlagt } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import BehandlingspunktIcon from './BehandlingspunktIcon';

import styles from './behandlingsprosessPanel.less';

// TODO (TOR) Flytt til fp-behandling-felles

/*
 * BehandlingsprosessPanel
 *
 * Presentasjonskomponent. Viser behandlingspunkt-ikonene som lar den NAV-ansatte velge behandingspunkt.
 * I tillegg vises navn og merknad knyttet til behandlingspunktet.
 */
export const BehandlingsprosessPanel = ({
  behandlingspunkter,
  selectedBehandlingspunkt,
  selectBehandlingspunktCallback,
  isSelectedBehandlingHenlagt,
  children,
}) => (
  <Panel className={styles.container}>
    { behandlingspunkter.map(bp => (
      <BehandlingspunktIcon
        key={bp}
        behandlingspunkt={bp}
        isSelectedBehandlingspunkt={bp === selectedBehandlingspunkt}
        isSelectedBehandlingHenlagt={isSelectedBehandlingHenlagt}
        selectBehandlingspunktCallback={selectBehandlingspunktCallback}
      />
    ))
      }
    <React.Fragment>
      {selectedBehandlingspunkt
          && children
        }
    </React.Fragment>
  </Panel>
);

BehandlingsprosessPanel.propTypes = {
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  selectBehandlingspunktCallback: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool,
  children: PropTypes.element,
};

BehandlingsprosessPanel.defaultProps = {
  selectedBehandlingspunkt: undefined,
  isSelectedBehandlingHenlagt: false,
  children: undefined,
};

const mapStateToProps = state => ({
  isSelectedBehandlingHenlagt: getBehandlingHenlagt(state),
});

export default connect(mapStateToProps)(BehandlingsprosessPanel);
