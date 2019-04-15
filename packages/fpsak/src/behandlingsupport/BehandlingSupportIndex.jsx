import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { trackRouteParam, getSupportPanelLocationCreator } from '@fpsak-frontend/fp-felles';
import { isKontrollerRevurderingAksjonspunkOpen } from 'behandling/duck';
import { getAccessibleSupportPanels, getEnabledSupportPanels } from './behandlingsupportSelectors';
import { getSelectedSupportPanel, setSelectedSupportPanel } from './duck';

import supportPanels from './supportPanels';
import LinkRow from './components/LinkRow';
import SupportPanelLink from './components/SupportPanelLink';
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
}) => (
  <div className={activeSupportPanel === supportPanels.APPROVAL ? styles.statusAksjonspunkt : styles.behandlingsupportIndex}>
    <div className={styles.marginBottom}>
      <LinkRow>
        {acccessibleSupportPanels.map(supportPanel => (
          <SupportPanelLink
            key={supportPanel}
            supportPanel={supportPanel}
            isEnabled={enabledSupportPanels.includes(supportPanel)}
            isActive={supportPanel === activeSupportPanel}
            supportPanelLocation={getSupportPanelLocation(supportPanel)}
          />
        ))}
      </LinkRow>
    </div>
    {renderSupportPanel(activeSupportPanel)}
  </div>
);

BehandlingSupportIndex.propTypes = {
  acccessibleSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  enabledSupportPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  activeSupportPanel: PropTypes.string.isRequired,
  getSupportPanelLocation: PropTypes.func.isRequired,
};

const getDefaultSupportPanel = (hasKontrollerRevurderingAp, enabledSupportPanels) => (
  hasKontrollerRevurderingAp ? supportPanels.MESSAGES : enabledSupportPanels.find(() => true) || supportPanels.HISTORY
);

const mapStateToProps = (state) => {
  const acccessibleSupportPanels = getAccessibleSupportPanels(state);
  const enabledSupportPanels = getEnabledSupportPanels(state);
  const selectedSupportPanel = getSelectedSupportPanel(state);
  const hasKontrollerRevurderingAp = isKontrollerRevurderingAksjonspunkOpen(state);
  const defaultSupportPanel = getDefaultSupportPanel(hasKontrollerRevurderingAp, enabledSupportPanels);
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
