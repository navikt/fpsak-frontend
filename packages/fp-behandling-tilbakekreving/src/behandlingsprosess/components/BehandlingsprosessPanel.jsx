import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import Panel from 'nav-frontend-paneler';

import { getBehandlingHenlagt } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getNotAcceptedByBeslutter } from 'behandlingTilbakekreving/src/behandlingsprosess/behandlingsprosessTilbakeSelectors';
import BehandlingspunktIcon from './BehandlingspunktIcon';

import styles from './behandlingsprosessPanel.less';

const classNames = classnames.bind(styles);

// TODO (TOR) Flytt til fp-behandling-felles

/*
 * BehandlingsprosessPanel
 *
 * Presentasjonskomponent. Viser behandlingspunkt-ikonene som lar den NAV-ansatte velge behandingspunkt.
 * I tillegg vises navn og merknad knyttet til behandlingspunktet.
 */

// TODO bruke samme behandlingsprosesspanel som i fpsak
export const BehandlingsprosessPanel = ({
  behandlingspunkter,
  selectedBehandlingspunkt,
  selectBehandlingspunktCallback,
  isSelectedBehandlingHenlagt,
  notAcceptedByBeslutter,
  children,
}) => {
  const selectedPos = behandlingspunkter.findIndex(punkt => punkt === selectedBehandlingspunkt) + 1;
  const arrowPositionStyle = `arrowLine_${selectedPos}`;

  return (
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
      <div className={classNames(arrowPositionStyle, { notAccepted: notAcceptedByBeslutter })}>
        {selectedBehandlingspunkt
          && children
        }
      </div>
    </Panel>
  );
};

BehandlingsprosessPanel.propTypes = {
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedBehandlingspunkt: PropTypes.string,
  selectBehandlingspunktCallback: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool,
  notAcceptedByBeslutter: PropTypes.bool,
  children: PropTypes.element,
};

BehandlingsprosessPanel.defaultProps = {
  selectedBehandlingspunkt: undefined,
  isSelectedBehandlingHenlagt: false,
  children: undefined,
  notAcceptedByBeslutter: false,
};

const mapStateToProps = state => ({
  isSelectedBehandlingHenlagt: getBehandlingHenlagt(state),
  notAcceptedByBeslutter: getNotAcceptedByBeslutter(state),
});

export default connect(mapStateToProps)(BehandlingsprosessPanel);
