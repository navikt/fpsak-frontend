import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { withFaktaIndex } from '@fpsak-frontend/fp-behandling-felles';
import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';

import { getRettigheter } from 'navAnsatt/duck';
import { getPersonopplysning, getBehandlingYtelseFordeling } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { setOpenInfoPanels, getOpenInfoPanels } from 'behandlingForstegangOgRevurdering/src/fakta/duckFaktaForstegangOgRev';
import { getFagsakYtelseType, getFagsakPerson } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
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
import PersonIndexPanel from './person/PersonIndexPanel';
import ArbeidsforholdInfoPanel from './arbeidsforholdInfoPanel/ArbeidsforholdInfoPanel';
import FodselOgTilretteleggingInfoPanel from './fodselOgTilrettelegging/FodselOgTilretteleggingInfoPanel';
import FordelBeregningsgrunnlagPanel from './fordelBeregningsgrunnlag/FordelBeregningsgrunnlagPanel';

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
  ytelsefordeling,
  fagsakPerson,
  erOverstyrer,
}) => (
  <React.Fragment>
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
      && (
      <PersonIndexPanel
        person={fagsakPerson}
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
    <div className={styles.container}>
      {personopplysninger
      && (
        <ArbeidsforholdInfoPanel
          aksjonspunkter={aksjonspunkter}
          submitCallback={submitCallback}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          readOnly={readOnly}
        />
      )
      }
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
      {FodselOgTilretteleggingInfoPanel.supports(aksjonspunkter)
      && (
      <FodselOgTilretteleggingInfoPanel
        aksjonspunkter={aksjonspunkter}
        openInfoPanels={openInfoPanels}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
        submitCallback={submitCallback}
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
      <BeregningInfoPanel
        aksjonspunkter={aksjonspunkter}
        openInfoPanels={openInfoPanels}
        toggleInfoPanelCallback={toggleInfoPanelCallback}
        shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
        submitCallback={submitCallback}
        readOnly={readOnly}
        erOverstyrer={erOverstyrer}
      />
      {(FordelBeregningsgrunnlagPanel.supports(aksjonspunkter))
      && (
        <FordelBeregningsgrunnlagPanel
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
      {UttakInfoPanel.supports(personopplysninger, ytelsesType, ytelsefordeling)
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
  </React.Fragment>
);

FaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkarCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  personopplysninger: PropTypes.shape(),
  ytelsefordeling: PropTypes.shape(),
  submitCallback: PropTypes.func.isRequired,
  /**
   * Oversikt over hvilke faktapaneler som er åpne
   */
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  shouldOpenDefaultInfoPanels: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  ytelsesType: PropTypes.shape().isRequired,
  fagsakPerson: PropTypes.shape().isRequired,
  erOverstyrer: PropTypes.bool.isRequired,
};

FaktaPanel.defaultProps = {
  personopplysninger: undefined,
  ytelsefordeling: undefined,
};

const mapStateToProps = (state) => {
  const rettigheter = getRettigheter(state);
  return {
    aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
    vilkarCodes: behandlingSelectors.getBehandlingVilkarCodes(state),
    ytelsesType: getFagsakYtelseType(state),
    openInfoPanels: getOpenInfoPanels(state),
    readOnly: !rettigheter.writeAccess.isEnabled || behandlingSelectors.getBehandlingIsOnHold(state) || behandlingSelectors.hasReadOnlyBehandling(state),
    personopplysninger: getPersonopplysning(state) || null,
    ytelsefordeling: getBehandlingYtelseFordeling(state),
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    fagsakPerson: getFagsakPerson(state),
  };
};

export default withFaktaIndex(setOpenInfoPanels, getOpenInfoPanels)(connect(mapStateToProps)(FaktaPanel));
