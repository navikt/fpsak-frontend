import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import FodselFaktaIndex from '@fpsak-frontend/fakta-fodsel';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import { featureToggle } from '@fpsak-frontend/fp-felles';
import { fodselsvilkarene, adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { getPersonopplysning, getBehandlingYtelseFordeling } from 'behandlingForstegangOgRevurdering/src/behandlingSelectors';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { getOpenInfoPanels } from 'behandlingForstegangOgRevurdering/src/fakta/duckFaktaForstegangOgRev';
import {
  getFagsakYtelseType, getFagsakPerson, getAlleKodeverk, getFeatureToggles,
} from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import OpptjeningInfoPanel from './opptjening/OpptjeningInfoPanel';
import DataFetcherWithCache from '../../DataFetcherWithCache';
import UttakInfoPanel from './uttak/UttakInfoPanel';
import BeregningInfoPanel from './beregning/BeregningInfoPanel';
import FodselOgTilretteleggingInfoPanel from './fodselOgTilrettelegging/FodselOgTilretteleggingInfoPanel';
import FordelBeregningsgrunnlagPanel from './fordelBeregningsgrunnlag/FordelBeregningsgrunnlagPanel';

import styles from './faktaPanel.less';

const adopsjonAksjonspunkter = [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE, aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
  aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN];
const fodselAksjonspunkter = [aksjonspunktCodes.TERMINBEKREFTELSE, aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL,
  aksjonspunktCodes.VURDER_OM_VILKAR_FOR_SYKDOM_ER_OPPFYLT];
const omsorgOgForeldreansvarAksjonspunkter = [aksjonspunktCodes.OMSORGSOVERTAKELSE, aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR];
const omsorgAksjonspunkter = [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG, aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG];

const fodselData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.FAMILIEHENDELSE, fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER, fpsakApi.ORIGINAL_BEHANDLING];
const omsorgOgForeldreansvarData = [fpsakApi.BEHANDLING, fpsakApi.FAMILIEHENDELSE, fpsakApi.SOKNAD, fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER, fpsakApi.INNTEKT_ARBEID_YTELSE];
const adopsjonData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.FAMILIEHENDELSE, fpsakApi.AKSJONSPUNKTER, fpsakApi.PERSONOPPLYSNINGER];
const tilleggsopplysningerData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.AKSJONSPUNKTER];
const vergeData = [fpsakApi.BEHANDLING, fpsakApi.VERGE, fpsakApi.AKSJONSPUNKTER];
const omsorgData = [fpsakApi.BEHANDLING, fpsakApi.YTELSEFORDELING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.AKSJONSPUNKTER, fpsakApi.SOKNAD];
const medlemskapData = [fpsakApi.BEHANDLING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.SOKNAD, fpsakApi.AKSJONSPUNKTER,
  fpsakApi.INNTEKT_ARBEID_YTELSE, fpsakApi.MEDLEMSKAP, fpsakApi.MEDLEMSKAP_V2];
const personData = [fpsakApi.BEHANDLING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.INNTEKT_ARBEID_YTELSE];
const arbeidsforholdData = [fpsakApi.BEHANDLING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.INNTEKT_ARBEID_YTELSE];

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
  alleMerknaderFraBeslutter,
  alleKodeverk,
  readOnlyBehandling,
  featureToggleUtland,
}) => (
  <>
    <div className={styles.personContainer}>
      <DataFetcherWithCache
        behandlingVersjon={1}
        data={personData}
        render={(props) => (
          <PersonFaktaIndex
            fagsakPerson={fagsakPerson}
            aksjonspunkter={aksjonspunkter}
            submitCallback={submitCallback}
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            readOnly={readOnly}
            featureToggleUtland={featureToggleUtland}
            alleKodeverk={alleKodeverk}
            {...props}
          />
        )}
      />
    </div>

    <div className={styles.container}>
      <DataFetcherWithCache
        behandlingVersjon={1}
        data={arbeidsforholdData}
        render={(props) => (
          <>
            {props.personopplysninger && (
              <ArbeidsforholdFaktaIndex
                alleKodeverk={alleKodeverk}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                aksjonspunkter={aksjonspunkter}
                submitCallback={submitCallback}
                openInfoPanels={openInfoPanels}
                toggleInfoPanelCallback={toggleInfoPanelCallback}
                shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
                readOnly={readOnly}
                {...props}
              />
            )}
          </>
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={vergeData}
        showComponent={aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE)}
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

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={tilleggsopplysningerData}
        showComponent={aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.TILLEGGSOPPLYSNINGER)}
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

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={omsorgOgForeldreansvarData}
        showComponent={aksjonspunkter.some((ap) => omsorgOgForeldreansvarAksjonspunkter.includes(ap.definisjon.kode))}
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

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={adopsjonData}
        showComponent={aksjonspunkter.some((ap) => adopsjonAksjonspunkter.includes(ap.definisjon.kode))
          || vilkarCodes.some((code) => adopsjonsvilkarene.includes(code))}
        render={(props) => (
          <AdopsjonFaktaIndex
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            submitCallback={submitCallback}
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            readOnly={readOnly}
            isForeldrepengerFagsak={ytelsesType.kode === fagsakYtelseType.FORELDREPENGER}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={fodselData}
        showComponent={aksjonspunkter.some((ap) => fodselAksjonspunkter.includes(ap.definisjon.kode))
          || vilkarCodes.some((code) => fodselsvilkarene.includes(code))}
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

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={medlemskapData}
        render={(props) => {
          if (props.personopplysninger && props.soknad) {
            return (
              <MedlemskapFaktaIndex
                alleKodeverk={alleKodeverk}
                openInfoPanels={openInfoPanels}
                toggleInfoPanelCallback={toggleInfoPanelCallback}
                shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
                submitCallback={submitCallback}
                readOnly={readOnly}
                isForeldrepengerFagsak={ytelsesType.kode === fagsakYtelseType.FORELDREPENGER}
                fagsakPerson={fagsakPerson}
                readOnlyBehandling={readOnlyBehandling}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                {...props}
              />
            );
          }
          return null;
        }}
      />

      { OpptjeningInfoPanel.supports(vilkarCodes) && (
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

      {(FordelBeregningsgrunnlagPanel.supports(aksjonspunkter)) && (
        <FordelBeregningsgrunnlagPanel
          aksjonspunkter={aksjonspunkter}
          openInfoPanels={openInfoPanels}
          toggleInfoPanelCallback={toggleInfoPanelCallback}
          shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
          submitCallback={submitCallback}
          readOnly={readOnly}
        />
      )}

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={omsorgData}
        showComponent={aksjonspunkter.some((ap) => omsorgAksjonspunkter.includes(ap.definisjon.kode))}
        render={(props) => (
          <OmsorgFaktaIndex
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            submitCallback={submitCallback}
            readOnly={readOnly}
            {...props}
          />
        )}
      />

      {UttakInfoPanel.supports(personopplysninger, ytelsesType, ytelsefordeling) && (
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
  readOnlyBehandling: PropTypes.bool.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  featureToggleUtland: PropTypes.bool.isRequired,
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
    ytelsefordeling: getBehandlingYtelseFordeling(state),
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    fagsakPerson: getFagsakPerson(state),
    alleMerknaderFraBeslutter: behandlingSelectors.getAllMerknaderFraBeslutter(state),
    alleKodeverk: getAlleKodeverk(state),
    readOnlyBehandling: behandlingSelectors.hasReadOnlyBehandling(state),
    featureToggleUtland: getFeatureToggles(state)[featureToggle.MARKER_UTENLANDSSAK],
  };
};

export default connect(mapStateToProps)(FaktaPanel);
