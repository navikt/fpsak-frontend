import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import { fodselsvilkarene, adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getPersonopplysning, getBehandlingYtelseFordeling } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getOpenInfoPanels } from 'behandlingForstegangOgRevurdering/src/fakta/duckFaktaForstegangOgRev';
import { getFagsakYtelseType, getFagsakPerson } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import OpptjeningInfoPanel from './opptjening/OpptjeningInfoPanel';
import DataFetcherWithCache from '../../DataFetcherWithCache';
import MedlemskapInfoPanel from './medlemskap/MedlemskapInfoPanel';
import OmsorgInfoPanel from './omsorg/OmsorgInfoPanel';
import UttakInfoPanel from './uttak/UttakInfoPanel';
import BeregningInfoPanel from './beregning/BeregningInfoPanel';
import PersonInfoPanel from './person/PersonInfoPanel';
import PersonIndexPanel from './person/PersonIndexPanel';
import ArbeidsforholdInfoPanel from './arbeidsforholdInfoPanel/ArbeidsforholdInfoPanel';
import FodselOgTilretteleggingInfoPanel from './fodselOgTilrettelegging/FodselOgTilretteleggingInfoPanel';
import FordelBeregningsgrunnlagPanel from './fordelBeregningsgrunnlag/FordelBeregningsgrunnlagPanel';

import styles from './faktaPanel.less';

const adopsjonAksjonspunkter = [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
  aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN];
const fodselAksjonspunkter = [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
  aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT];
const omsorgOgForeldreansvarAksjonspunkter = [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR];

const fodselData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.FAMILIEHENDELSE, fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER, fpsakApi.ORIGINAL_BEHANDLING];
const omsorgOgForeldreansvarData = [fpsakApi.BEHANDLING, fpsakApi.FAMILIEHENDELSE, fpsakApi.SOKNAD, fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER, fpsakApi.INNTEKT_ARBEID_YTELSE];
const adopsjonData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.FAMILIEHENDELSE, fpsakApi.AKSJONSPUNKTER, fpsakApi.PERSONOPPLYSNINGER];
const tilleggsopplysningerData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.AKSJONSPUNKTER];
const vergeData = [fpsakApi.BEHANDLING, fpsakApi.VERGE, fpsakApi.AKSJONSPUNKTER];

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
  soknad,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  ytelsesType,
  ytelsefordeling,
  fagsakPerson,
  erOverstyrer,
  alleMerknaderFraBeslutter,
  alleKodeverk,
}) => (
  <>
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
      )}
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
      )}
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
      )}

      {aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={vergeData}
          render={(props) => (
            <VergeFaktaIndex
              alleKodeverk={alleKodeverk}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              submitCallback={submitCallback}
              openInfoPanels={openInfoPanels}
              toggleInfoPanelCallback={toggleInfoPanelCallback}
              shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
              readOnly={readOnly}
              {...props}
            />
          )}
        />
      )}

      {aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.TILLEGGSOPPLYSNINGER) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={tilleggsopplysningerData}
          render={(props) => (
            <TilleggsopplysningerFaktaIndex
              submitCallback={submitCallback}
              openInfoPanels={openInfoPanels}
              toggleInfoPanelCallback={toggleInfoPanelCallback}
              shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
              readOnly={readOnly}
              {...props}
            />
          )}
        />
      )}

      {aksjonspunkter.some((ap) => omsorgOgForeldreansvarAksjonspunkter.includes(ap.definisjon.kode)) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={omsorgOgForeldreansvarData}
          render={(props) => (
            <OmsorgOgForeldreansvarFaktaIndex
              alleKodeverk={alleKodeverk}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              submitCallback={submitCallback}
              openInfoPanels={openInfoPanels}
              toggleInfoPanelCallback={toggleInfoPanelCallback}
              shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
              readOnly={readOnly}
              {...props}
            />
          )}
        />
      )}
      {FodselOgTilretteleggingInfoPanel.supports(aksjonspunkter) && (
        <FodselOgTilretteleggingInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )}

      {(aksjonspunkter.some((ap) => adopsjonAksjonspunkter.includes(ap.definisjon.kode)) || vilkarCodes.some((code) => adopsjonsvilkarene.includes(code))) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={adopsjonData}
          render={(props) => (
            <AdopsjonFaktaIndex
              alleKodeverk={alleKodeverk}
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              submitCallback={submitCallback}
              openInfoPanels={openInfoPanels}
              toggleInfoPanelCallback={toggleInfoPanelCallback}
              shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
              readOnly={readOnly}
              isForeldrepengerFagsak={ytelsesType === fagsakYtelseType.FORELDREPENGER}
              {...props}
            />
          )}
        />
      )}

      {(aksjonspunkter.some((ap) => fodselAksjonspunkter.includes(ap.definisjon.kode)) || vilkarCodes.some((code) => fodselsvilkarene.includes(code))) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
          data={fodselData}
          render={(props) => (
            <FodselFaktaIndex
              alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
              submitCallback={submitCallback}
              openInfoPanels={openInfoPanels}
              toggleInfoPanelCallback={toggleInfoPanelCallback}
              shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
              readOnly={readOnly}
              {...props}
            />
          )}
        />
      )}
      { MedlemskapInfoPanel.supports(personopplysninger, soknad)
      && (
        <MedlemskapInfoPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )}
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
      )}
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
      )}
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
      )}
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
      )}
    </div>
  </>
);

FaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkarCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  personopplysninger: PropTypes.shape(),
  soknad: PropTypes.shape(),
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
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
};

FaktaPanel.defaultProps = {
  personopplysninger: undefined,
  soknad: undefined,
  ytelsefordeling: undefined,
};

const mapStateToProps = (state) => {
  const rettigheter = behandlingSelectors.getRettigheter(state);
  return {
    aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
    vilkarCodes: behandlingSelectors.getBehandlingVilkarCodes(state),
    ytelsesType: getFagsakYtelseType(state),
    openInfoPanels: getOpenInfoPanels(state),
    readOnly: !rettigheter.writeAccess.isEnabled || behandlingSelectors.getBehandlingIsOnHold(state) || behandlingSelectors.hasReadOnlyBehandling(state),
    personopplysninger: getPersonopplysning(state) || null,
    soknad: behandlingSelectors.getSoknad(state),
    ytelsefordeling: getBehandlingYtelseFordeling(state),
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    fagsakPerson: getFagsakPerson(state),
    alleMerknaderFraBeslutter: behandlingSelectors.getAllMerknaderFraBeslutter(state),
    alleKodeverk: getAlleKodeverk(state),
  };
};

export default connect(mapStateToProps)(FaktaPanel);
