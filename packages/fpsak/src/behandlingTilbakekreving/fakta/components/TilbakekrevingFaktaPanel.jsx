import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PersonIndex from 'person/PersonIndex';
import { getRettigheter } from 'navAnsatt/duck';
import aksjonspunktPropType from 'behandlingFelles/proptypes/aksjonspunktPropType';
import {
  getPersonopplysning, getBehandlingIsOnHold, getAksjonspunkter, hasReadOnlyBehandling,
} from 'behandlingTilbakekreving/tilbakekrevingBehandlingSelectors';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { getOpenInfoPanels } from '../duck';
import PersonInfoPanel from './person/PersonInfoPanel';

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
