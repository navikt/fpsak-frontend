import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getSupportPanelLocationCreator, trackRouteParam } from '@fpsak-frontend/fp-felles';
import SupportMenySakIndex, { supportTabs } from '@fpsak-frontend/sak-support-meny';

import { getAccessibleSupportPanels, getEnabledSupportPanels } from './behandlingsupportSelectors';
import { getSelectedSupportPanel, setSelectedSupportPanel } from './duck';
import BehandlingsupportDataResolver from './BehandlingsupportDataResolver';
import HistoryIndex from './history/HistoryIndex';
import MessagesIndex from './messages/MessagesIndex';
import DocumentIndex from './documents/DocumentIndex';
import ApprovalIndex from './approval/ApprovalIndex';

import styles from './behandlingSupportIndex.less';

const renderSupportPanel = (supportPanel) => {
  switch (supportPanel) {
    case supportTabs.APPROVAL:
    case supportTabs.RETURNED:
      return (<ApprovalIndex />);
    case supportTabs.HISTORY:
      return (<HistoryIndex />);
    case supportTabs.MESSAGES:
      return (<MessagesIndex />);
    case supportTabs.DOCUMENTS:
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
  }, [history.location, acccessibleSupportPanels]);

  return (
    <BehandlingsupportDataResolver>
      <div className={styles.meny}>
        <SupportMenySakIndex
          tilgjengeligeTabs={acccessibleSupportPanels}
          valgbareTabs={enabledSupportPanels}
          valgtIndex={acccessibleSupportPanels.findIndex((p) => p === activeSupportPanel)}
          onClick={changeRouteCallback}
        />
      </div>
      <div className={(activeSupportPanel === supportTabs.HISTORY ? styles.containerHistorikk : styles.container)}>
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
  enabledSupportPanels.find(() => true) || supportTabs.HISTORY
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
