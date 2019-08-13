import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFaktaIndex } from '@fpsak-frontend/fp-behandling-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { PersonIndex } from '@fpsak-frontend/fp-felles';

import { getRettigheter } from 'navAnsatt/duck';
import {
  getBehandlingIsOnHold, getAksjonspunkter, hasReadOnlyBehandling, getFeilutbetalingFakta,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import {
  setOpenInfoPanels, getOpenInfoPanels,
} from '../duckFaktaTilbake';
import { getFagsakPerson } from '../../duckTilbake';
import FeilutbetalingInfoPanel from './feilutbetaling/FeilutbetalingInfoPanel';

import styles from './tilbakekrevingFaktaPanel.less';

/**
 * TilbakekrevingFaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const TilbakekrevingFaktaPanel = ({
  aksjonspunkter,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  feilutbetaling,
  fagsakPerson,
}) => (
  <>
    <div className={styles.personContainer}>
      <PersonIndex medPanel person={fagsakPerson} />
      {feilutbetaling && (
        <FeilutbetalingInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )}
    </div>
    <div className={styles.container} />
  </>
);

TilbakekrevingFaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  feilutbetaling: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
};

TilbakekrevingFaktaPanel.defaultProps = {
  feilutbetaling: null,
};

const mapStateToProps = state => ({
  aksjonspunkter: getAksjonspunkter(state),
  openInfoPanels: getOpenInfoPanels(state),
  readOnly: !getRettigheter(state).writeAccess.isEnabled || getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
  feilutbetaling: getFeilutbetalingFakta(state),
  fagsakPerson: getFagsakPerson(state),
});

export default withFaktaIndex(setOpenInfoPanels, getOpenInfoPanels)(connect(mapStateToProps)(TilbakekrevingFaktaPanel));
