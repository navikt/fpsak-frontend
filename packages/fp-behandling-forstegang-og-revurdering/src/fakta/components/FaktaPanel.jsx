import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import TilleggsopplysningerFaktaIndex from '@fpsak-frontend/fakta-tilleggsopplysninger';
import OmsorgFaktaIndex from '@fpsak-frontend/fakta-omsorg';
import AdopsjonFaktaIndex from '@fpsak-frontend/fakta-adopsjon';
import VergeFaktaIndex from '@fpsak-frontend/fakta-verge';
import OmsorgOgForeldreansvarFaktaIndex from '@fpsak-frontend/fakta-omsorg-og-foreldreansvar';
import PersonFaktaIndex from '@fpsak-frontend/fakta-person';
import OpptjeningFaktaIndex from '@fpsak-frontend/fakta-opptjening';
import BeregningFaktaIndex from '@fpsak-frontend/fakta-beregning';
import FodselOgTilretteleggingFaktaIndex from '@fpsak-frontend/fakta-fodsel-og-tilrettelegging';
import ArbeidsforholdFaktaIndex from '@fpsak-frontend/fakta-arbeidsforhold';
import MedlemskapFaktaIndex from '@fpsak-frontend/fakta-medlemskap';
import FordelBeregningsgrunnlagFaktaIndex from '@fpsak-frontend/fakta-fordel-beregningsgrunnlag';
import { featureToggle } from '@fpsak-frontend/fp-felles';
import vilkarType, { adopsjonsvilkarene } from '@fpsak-frontend/kodeverk/src/vilkarType';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import behandlingSelectors from '../../selectors/forsteOgRevBehandlingSelectors';
import { getOpenInfoPanels } from '../duckFaktaForstegangOgRev';
import {
  getFagsakYtelseType,
  getFagsakPerson,
  getAlleKodeverk,
  getFeatureToggles,
} from '../../duckBehandlingForstegangOgRev';
import fpsakApi from '../../data/fpsakBehandlingApi';
import DataFetcherWithCache from '../../DataFetcherWithCache';

import styles from './faktaPanel.less';

const adopsjonAksjonspunkter = [
  aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE,
  aksjonspunktCodes.ADOPSJONSDOKUMENTAJON,
  aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN,
];
const omsorgOgForeldreansvarAksjonspunkter = [
  aksjonspunktCodes.OMSORGSOVERTAKELSE,
  aksjonspunktCodes.AVKLAR_VILKAR_FOR_FORELDREANSVAR,
];
const omsorgAksjonspunkter = [
  aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG,
  aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG,
];
const fordelBeregningsgrunnlagAksjonspunkter = [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG];

const omsorgOgForeldreansvarData = [
  fpsakApi.BEHANDLING,
  fpsakApi.FAMILIEHENDELSE,
  fpsakApi.SOKNAD,
  fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER,
  fpsakApi.INNTEKT_ARBEID_YTELSE,
];
const adopsjonData = [
  fpsakApi.BEHANDLING,
  fpsakApi.SOKNAD,
  fpsakApi.FAMILIEHENDELSE,
  fpsakApi.AKSJONSPUNKTER,
  fpsakApi.PERSONOPPLYSNINGER,
];
const tilleggsopplysningerData = [fpsakApi.BEHANDLING, fpsakApi.SOKNAD, fpsakApi.AKSJONSPUNKTER];
const vergeData = [fpsakApi.BEHANDLING, fpsakApi.VERGE, fpsakApi.AKSJONSPUNKTER];
const omsorgData = [
  fpsakApi.BEHANDLING,
  fpsakApi.YTELSEFORDELING,
  fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.AKSJONSPUNKTER,
  fpsakApi.SOKNAD,
];
const medlemskapData = [
  fpsakApi.BEHANDLING,
  fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.SOKNAD,
  fpsakApi.AKSJONSPUNKTER,
  fpsakApi.INNTEKT_ARBEID_YTELSE,
  fpsakApi.MEDLEMSKAP,
  fpsakApi.MEDLEMSKAP_V2,
];
const personData = [fpsakApi.BEHANDLING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.INNTEKT_ARBEID_YTELSE];
const arbeidsforholdData = [fpsakApi.BEHANDLING, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.INNTEKT_ARBEID_YTELSE];
const opptjeningData = [fpsakApi.BEHANDLING, fpsakApi.OPPTJENING];
const beregningData = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGSGRUNNLAG, fpsakApi.AKSJONSPUNKTER];
const fodselOgTilretteleggingData = [fpsakApi.BEHANDLING, fpsakApi.SVANGERSKAPSPENGER_TILRETTELEGGING];
const fordelBeregningsgrunnlagData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.BEREGNINGSGRUNNLAG];

/**
 * FaktaPanel
 *
 * Presentasjonskomponent. Har ansvar for visningen av de ulike faktapanelene. Dette gjøres
 * ved å gå gjennom aksjonspunktene og en gjør så en mapping mellom aksjonspunktene og panelene.
 */
export const FaktaPanel = ({
  // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  aksjonspunkter,
  vilkarCodes,
  submitCallback,
  openInfoPanels,
  toggleInfoPanelCallback,
  shouldOpenDefaultInfoPanels,
  readOnly,
  ytelsesType,
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
        render={(componentProps) => (
          <>
            {componentProps.personopplysninger && (
              <ArbeidsforholdFaktaIndex
                alleKodeverk={alleKodeverk}
                alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
                aksjonspunkter={aksjonspunkter}
                submitCallback={submitCallback}
                openInfoPanels={openInfoPanels}
                toggleInfoPanelCallback={toggleInfoPanelCallback}
                shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
                readOnly={readOnly}
                {...componentProps}
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

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={fodselOgTilretteleggingData}
        showComponent={aksjonspunkter.some((ap) => ap.definisjon.kode === aksjonspunktCodes.FODSELTILRETTELEGGING)}
        render={(props) => (
          <FodselOgTilretteleggingFaktaIndex
            aksjonspunkter={aksjonspunkter}
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            submitCallback={submitCallback}
            readOnly={readOnly}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={adopsjonData}
        showComponent={
          aksjonspunkter.some((ap) => adopsjonAksjonspunkter.includes(ap.definisjon.kode))
          || vilkarCodes.some((code) => adopsjonsvilkarene.includes(code))
        }
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
        data={medlemskapData}
        render={(componentProps) => {
          if (componentProps.personopplysninger && componentProps.soknad) {
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
                {...componentProps}
              />
            );
          }
          return null;
        }}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={opptjeningData}
        showComponent={vilkarCodes.some((code) => code === vilkarType.OPPTJENINGSVILKARET)}
        render={(props) => (
          <OpptjeningFaktaIndex
            aksjonspunkter={aksjonspunkter}
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            submitCallback={submitCallback}
            readOnly={readOnly}
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={beregningData}
        render={(props) => (
          <BeregningFaktaIndex
            openInfoPanels={openInfoPanels}
            toggleInfoPanelCallback={toggleInfoPanelCallback}
            shouldOpenDefaultInfoPanels={shouldOpenDefaultInfoPanels}
            submitCallback={submitCallback}
            readOnly={readOnly}
            alleKodeverk={alleKodeverk}
            alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
            erOverstyrer={erOverstyrer}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        data={fordelBeregningsgrunnlagData}
        showComponent={aksjonspunkter.some((ap) => fordelBeregningsgrunnlagAksjonspunkter.includes(ap.definisjon.kode))}
        render={(props) => (
          <FordelBeregningsgrunnlagFaktaIndex
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
    </div>
  </>
);

FaktaPanel.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  vilkarCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  soknad: PropTypes.shape(),
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
  soknad: undefined,
};

const mapStateToProps = (state) => {
  const rettigheter = behandlingSelectors.getRettigheter(state);
  const aksjonspunkter = behandlingSelectors.getAksjonspunkter(state);
  return {
    aksjonspunkter,
    vilkarCodes: behandlingSelectors.getBehandlingVilkarCodes(state),
    ytelsesType: getFagsakYtelseType(state),
    openInfoPanels: getOpenInfoPanels(state),
    readOnly:
      !rettigheter.writeAccess.isEnabled
      || behandlingSelectors.getBehandlingIsOnHold(state)
      || behandlingSelectors.hasReadOnlyBehandling(state),
    erOverstyrer: rettigheter.kanOverstyreAccess.isEnabled,
    fagsakPerson: getFagsakPerson(state),
    alleMerknaderFraBeslutter: behandlingSelectors.getAllMerknaderFraBeslutter(state),
    alleKodeverk: getAlleKodeverk(state),
    readOnlyBehandling: behandlingSelectors.hasReadOnlyBehandling(state),
    featureToggleUtland: getFeatureToggles(state)[featureToggle.MARKER_UTENLANDSSAK],
  };
};

export default connect(mapStateToProps)(FaktaPanel);
