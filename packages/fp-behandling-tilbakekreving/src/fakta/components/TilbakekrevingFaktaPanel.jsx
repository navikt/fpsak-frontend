import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { getRettigheter } from 'navAnsatt/duck';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { PersonIndex } from '@fpsak-frontend/fp-felles';
import {
  getPersonopplysning, getBehandlingIsOnHold, getAksjonspunkter, hasReadOnlyBehandling, getFeilutbetalingFakta,
} from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { ElementWrapper } from '@fpsak-frontend/shared-components';
import { getOpenInfoPanels } from '../duckFaktaTilbake';
import { getFagsakPerson } from '../../duckTilbake';
import PersonInfoPanel from './person/PersonInfoPanel';
import FeilutbetalingInfoPanel from './feilutbetaling/FeilutbetalingInfoPanel';

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
  feilutbetaling,
  fagsakPerson,
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
      && <PersonIndex medPanel person={fagsakPerson} />
      }
      {feilutbetaling
      && (
        <FeilutbetalingInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
    </div>
    <div className={styles.container} />
  </ElementWrapper>
);

TilbakekrevingFaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  personopplysninger: PropTypes.shape(),
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
  personopplysninger: undefined,
  feilutbetaling: null,
};

const mapStateToProps = state => ({
  aksjonspunkter: getAksjonspunkter(state),
  openInfoPanels: getOpenInfoPanels(state),
  readOnly: !getRettigheter(state).writeAccess.isEnabled || getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
  personopplysninger: getPersonopplysning(state) || null,
  feilutbetaling: getFeilutbetalingFakta(state),
  fagsakPerson: getFagsakPerson(state),
});

export default connect(mapStateToProps)(TilbakekrevingFaktaPanel);
