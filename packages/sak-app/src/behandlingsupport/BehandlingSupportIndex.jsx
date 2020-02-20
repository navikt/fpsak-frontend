import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getSupportPanelLocationCreator, trackRouteParam } from '@fpsak-frontend/fp-felles';
import SupportMenySakIndex from '@fpsak-frontend/sak-support-meny';

import { getAccessibleSupportPanels, getEnabledSupportPanels } from './behandlingsupportSelectors';
import { getSelectedSupportPanel, setSelectedSupportPanel } from './duck';
import BehandlingsupportDataResolver from './BehandlingsupportDataResolver';
import supportPanels from './supportPanels';
import HistoryIndex from './history/HistoryIndex';
import MessagesIndex from './messages/MessagesIndex';
import DocumentIndex from './documents/DocumentIndex';
import ApprovalIndex from './approval/ApprovalIndex';

import styles from './behandlingSupportIndex.less';

const renderSupportPanel = (supportPanel) => {
  switch (supportPanel) {
    case supportPanels.APPROVAL:
    case supportPanels.RETURNED:
      return (<ApprovalIndex />);
    case supportPanels.HISTORY:
      return (<HistoryIndex />);
    case supportPanels.MESSAGES:
      return (<MessagesIndex />);
    case supportPanels.DOCUMENTS:
      return (<DocumentIndex />);
    default:
      return null;
  }
};

/**
 * BehandlingSupportIndex
 *
 * Containerkomponent for behandlingsstøttepanelet.
 * Har ansvar for å lage navigasjonsrad med korrekte navigasjonsvalg, og route til rett
 * støttepanelkomponent ihht. gitt parameter i URL-en.
 */
export const BehandlingSupportIndex = ({
  activeSupportPanel,
  acccessibleSupportPanels,
  enabledSupportPanels,
  getSupportPanelLocation,
}) => {
  const history = useHistory();
  const changeRouteCallback = useCallback((index) => {
    const supportPanel = acccessibleSupportPanels[index];
    history.push(getSupportPanelLocation(supportPanel));
  }, [history, acccessibleSupportPanels]);

  return (
    <BehandlingsupportDataResolver>
      <div className={styles.meny}>
        <SupportMenySakIndex
          erTilBeslutter={acccessibleSupportPanels.includes(supportPanels.APPROVAL)}
          erFraBeslutter={acccessibleSupportPanels.includes(supportPanels.RETURNED)}
          erSendMeldingAktiv={enabledSupportPanels.includes(activeSupportPanel)}
          valgtIndex={acccessibleSupportPanels.findIndex((p) => p === activeSupportPanel)}
          onClick={changeRouteCallback}
        />
      </div>
      <div className={(activeSupportPanel === supportPanels.HISTORY ? styles.containerHistorikk : styles.container)}>
        {renderSupportPanel(activeSupportPanel)}
      </div>
    </BehandlingsupportDataResolver>
  );
};

BehandlingSupportIndex.propTypes = {
  acccessibleSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  enabledSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSupportPanel: PropTypes.string.isRequired,
  getSupportPanelLocation: PropTypes.func.isRequired,
};

const getDefaultSupportPanel = (enabledSupportPanels) => (
  enabledSupportPanels.find(() => true) || supportPanels.HISTORY
);

const mapStateToProps = (state) => {
  const acccessibleSupportPanels = getAccessibleSupportPanels(state);
  const enabledSupportPanels = getEnabledSupportPanels(state);
  const selectedSupportPanel = getSelectedSupportPanel(state);

  const defaultSupportPanel = getDefaultSupportPanel(enabledSupportPanels);
  const activeSupportPanel = enabledSupportPanels.includes(selectedSupportPanel) ? selectedSupportPanel : defaultSupportPanel;
  return {
    acccessibleSupportPanels, enabledSupportPanels, activeSupportPanel,
  };
};

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...dispatchProps,
  ...stateProps,
  getSupportPanelLocation: getSupportPanelLocationCreator(ownProps.location), // gets prop 'location' from trackRouteParam
});

export default trackRouteParam({
  paramName: 'stotte',
  paramPropType: PropTypes.string,
  storeParam: setSelectedSupportPanel,
  getParamFromStore: getSelectedSupportPanel,
  isQueryParam: true,
})(connect(mapStateToProps, null, mergeProps)(BehandlingSupportIndex));
