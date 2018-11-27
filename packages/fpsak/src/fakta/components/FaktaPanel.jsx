import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PersonIndex from 'person/PersonIndex';
import { getRettigheter } from 'navAnsatt/duck';
import {
  getBehandlingVilkarCodes, getPersonopplysning, getBehandlingIsOnHold, getAksjonspunkter, hasReadOnlyBehandling,
}
  from 'behandling/behandlingSelectors';
import aksjonspunktPropType from 'behandling/proptypes/aksjonspunktPropType';
import { getOpenInfoPanels } from 'fakta/duck';
import { getFagsakYtelseType } from 'fagsak/fagsakSelectors';
import ElementWrapper from 'sharedComponents/ElementWrapper';
import FodselInfoPanel from './fodsel/FodselInfoPanel';
import TilleggsopplysningerInfoPanel from './tilleggsopplysninger/TilleggsopplysningerInfoPanel';
import OpptjeningInfoPanel from './opptjening/OpptjeningInfoPanel';
import OmsorgOgForeldreansvarInfoPanel from './omsorgOgForeldreansvar/OmsorgOgForeldreansvarInfoPanel';
import AdopsjonInfoPanel from './adopsjon/AdopsjonInfoPanel';
import MedlemskapInfoPanel from './medlemskap/MedlemskapInfoPanel';
import RegistrereVergeInfoPanel from './verge/RegistrereVergeInfoPanel';
import OmsorgInfoPanel from './omsorg/OmsorgInfoPanel';
import UttakInfoPanel from './uttak/UttakInfoPanel';
import BeregningInfoPanel from './beregning/BeregningInfoPanel';
import PersonInfoPanel from './person/PersonInfoPanel';

import styles from './faktaPanel.less';

/**
 * FaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  aksjonspunkter,
  vilkarCodes,
  personopplysninger,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  ytelsesType,
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
    <div className={styles.container}>
      {RegistrereVergeInfoPanel.supports(aksjonspunkter)
      && (
        <RegistrereVergeInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
      {TilleggsopplysningerInfoPanel.supports(aksjonspunkter)
      && (
        <TilleggsopplysningerInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }

      {OmsorgOgForeldreansvarInfoPanel.supports(aksjonspunkter)
      && (
        <OmsorgOgForeldreansvarInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
      {AdopsjonInfoPanel.supports(vilkarCodes, aksjonspunkter)
      && (
        <AdopsjonInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
      {FodselInfoPanel.supports(vilkarCodes, aksjonspunkter)
      && (
        <FodselInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
      { MedlemskapInfoPanel.supports(personopplysninger)
      && (
        <MedlemskapInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )
      }
      { OpptjeningInfoPanel.supports(vilkarCodes)
      && (
        <OpptjeningInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )
      }
      {BeregningInfoPanel.supports(aksjonspunkter)
      && (
        <BeregningInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )
      }
      {OmsorgInfoPanel.supports(aksjonspunkter)
      && (
        <OmsorgInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )
      }
      {UttakInfoPanel.supports(personopplysninger, ytelsesType)
      && (
        <UttakInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )
      }
    </div>
  </ElementWrapper>
);

FaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkarCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  personopplysninger: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelsesType: PropTypes.shape().isRequired,
};

FaktaPanel.defaultProps = {
  personopplysninger: undefined,
};

const mapStateToProps = state => ({
  aksjonspunkter: getAksjonspunkter(state),
  vilkarCodes: getBehandlingVilkarCodes(state),
  ytelsesType: getFagsakYtelseType(state),
  openInfoPanels: getOpenInfoPanels(state),
  readOnly: !getRettigheter(state).writeAccess.isEnabled || getBehandlingIsOnHold(state) || hasReadOnlyBehandling(state),
  personopplysninger: getPersonopplysning(state) || null,
});

export default connect(mapStateToProps)(FaktaPanel);
