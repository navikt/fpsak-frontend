import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PersonIndex from 'person/PersonIndex';
import { getRettigheter } from 'navAnsatt/duck';
import {
  getPersonopplysning, getBehandlingIsOnHold, getAksjonspunkter, hasReadOnlyBehandling,
}
  from 'behandling/behandlingSelectors';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import { getOpenInfoPanels } from 'fakta/duck';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import PersonInfoPanel from 'fakta/components/person/PersonInfoPanel';

import styles from './tilbakekrevingFaktaPanel.less';

/**
 * TilbakekrevingFaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const TilbakekrevingFaktaPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  aksjonspunkter,
  personopplysninger,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
}) => (
  <ElementWrapper>
    <div className={styles.personContainer}>
      {personopplysninger
      && (
        <PersonInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
      {!personopplysninger
      && <PersonIndex medPanel />
      }
    </div>
    <div className={styles.container} />
  </ElementWrapper>
);

TilbakekrevingFaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  personopplysninger: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
};

TilbakekrevingFaktaPanel.defaultProps = {
  personopplysninger: undefined,
};

const mapStateToProps = state => ({
  aksjonspunkter: getAksjonspunkter(state),
  openInfoPanels: getOpenInfoPanels(state),
  readOnly: !getRettigheter(state).writeAccess.isEnabled || getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
  personopplysninger: getPersonopplysning(state) || null,
});

export default connect(mapStateToProps)(TilbakekrevingFaktaPanel);
