import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';
import { bindActionCreators } from 'redux';

import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';
import BeregningsgrunnlagProsessIndex from '@fpsak-frontend/prosess-beregningsgrunnlag';
import BeregningsresultatProsessIndex from '@fpsak-frontend/prosess-beregningsresultat';
import VarselOmRevurderingProsessIndex from '@fpsak-frontend/prosess-varsel-om-revurdering';
import CheckPersonStatusIndex from '@fpsak-frontend/prosess-saksopplysninger';
import VurderSoknadsfristForeldrepengerIndex from '@fpsak-frontend/prosess-soknadsfrist';
import TilkjentYtelseProsessIndex from '@fpsak-frontend/prosess-tilkjent-ytelse';
import VedtakProsessIndex from '@fpsak-frontend/prosess-vedtak';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import UttakProsessIndex from '@fpsak-frontend/prosess-uttak';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import { toggleBehandlingspunktOverstyring, tempUpdateStonadskontoer } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import { getFeatureToggles, getFagsakInfo, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import VilkarPanels from './VilkarPanels';
import DataFetcherWithCache from '../../DataFetcherWithCache';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

const avregningData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.SIMULERING_RESULTAT, fpsakApi.TILBAKEKREVINGVALG];
const beregningsgrunnlagData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.BEREGNINGSGRUNNLAG];
const beregningsresultatData = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT_ENGANGSSTONAD];
const revurderingData = [fpsakApi.BEHANDLING, fpsakApi.FAMILIEHENDELSE, fpsakApi.SOKNAD, fpsakApi.ORIGINAL_BEHANDLING];
const sjekkPersonStatusData = [fpsakApi.BEHANDLING, fpsakApi.MEDLEMSKAP, fpsakApi.PERSONOPPLYSNINGER];
const soknadsfristData = [fpsakApi.BEHANDLING, fpsakApi.UTTAK_PERIODE_GRENSE, fpsakApi.SOKNAD];
const tilkjentYtelseData = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT, fpsakApi.FAMILIEHENDELSE, fpsakApi.PERSONOPPLYSNINGER, fpsakApi.SOKNAD];
const vedtakDataES = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT_ENGANGSSTONAD, fpsakApi.TILBAKEKREVINGVALG,
  fpsakApi.SIMULERING_RESULTAT, fpsakApi.VILKAR, fpsakApi.SEND_VARSEL_OM_REVURDERING, fpsakApi.ORIGINAL_BEHANDLING,
  fpsakApi.MEDLEMSKAP];
const vedtakDataFpOgSvp = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT_FORELDREPENGER, fpsakApi.TILBAKEKREVINGVALG,
  fpsakApi.SIMULERING_RESULTAT, fpsakApi.VILKAR, fpsakApi.SEND_VARSEL_OM_REVURDERING, fpsakApi.ORIGINAL_BEHANDLING,
  fpsakApi.MEDLEMSKAP];
const uttakData = [
  fpsakApi.BEHANDLING,
  fpsakApi.FAKTA_ARBEIDSFORHOLD,
  fpsakApi.UTTAKSRESULTAT_PERIODER,
  fpsakApi.UTTAK_STONADSKONTOER,
  fpsakApi.FAMILIEHENDELSE,
  fpsakApi.SOKNAD,
  fpsakApi.PERSONOPPLYSNINGER,
  fpsakApi.UTTAK_PERIODE_GRENSE,
  fpsakApi.YTELSEFORDELING,
];

const uttakAksjonspunkter = [
  aksjonspunktCodes.TILKNYTTET_STORTINGET,
  aksjonspunktCodes.KONTROLLER_REALITETSBEHANDLING_ELLER_KLAGE,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_MEDLEMSKAP,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_FORDELING_AV_STØNADSPERIODEN,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD,
  aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET,
  aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT,
  aksjonspunktCodes.FASTSETT_UTTAKPERIODER,
];


/*
 * PunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  submitCallback,
  previewCallback,
  previewFptilbakeCallback,
  dispatchSubmitFailed,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
  fagsakInfo,
  featureToggles,
  overrideReadOnly,
  kanOverstyreAccess,
  behandlingspunktAksjonspunkter,
  alleAksjonspunkter,
  toggleOverstyring,
  alleKodeverk,
  behandlingspunktVilkar,
  tempUpdate,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <VilkarPanels
        isAksjonspunktOpen={openAksjonspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        submitCallback={submitCallback}
        fagsakInfo={fagsakInfo}
        alleKodeverk={alleKodeverk}
        kanOverstyreAccess={kanOverstyreAccess}
        toggleOverstyring={toggleOverstyring}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.VEDTAK}
        data={fagsakInfo.ytelseType.kode === fagsakYtelseType.ENGANGSSTONAD ? vedtakDataES : vedtakDataFpOgSvp}
        render={(props) => (
          <VedtakProsessIndex
            aksjonspunkter={alleAksjonspunkter}
            readOnly={readOnly}
            previewCallback={previewCallback}
            submitCallback={submitCallback}
            ytelseType={fagsakInfo.ytelseType}
            employeeHasAccess={kanOverstyreAccess.employeeHasAccess}
            alleKodeverk={alleKodeverk}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.BEREGNING}
        data={beregningsresultatData}
        render={(props) => (
          <BeregningsresultatProsessIndex
            submitCallback={submitCallback}
            overrideReadOnly={overrideReadOnly}
            kanOverstyreAccess={kanOverstyreAccess}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            toggleOverstyring={toggleOverstyring}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.SAKSOPPLYSNINGER}
        data={sjekkPersonStatusData}
        render={(props) => (
          <CheckPersonStatusIndex
            aksjonspunkter={behandlingspunktAksjonspunkter}
            alleKodeverk={alleKodeverk}
            submitCallback={submitCallback}
            readOnly={readOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.VARSEL}
        data={revurderingData}
        render={(props) => (
          <VarselOmRevurderingProsessIndex
            submitCallback={submitCallback}
            previewCallback={previewCallback}
            dispatchSubmitFailed={dispatchSubmitFailed}
            readOnly={readOnly}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            alleKodeverk={alleKodeverk}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.BEREGNINGSGRUNNLAG}
        data={beregningsgrunnlagData}
        render={(props) => (
          <BeregningsgrunnlagProsessIndex
            fagsak={fagsakInfo}
            submitCallback={submitCallback}
            readOnly={readOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            apCodes={apCodes}
            alleKodeverk={alleKodeverk}
            isApOpen={openAksjonspunkt}
            vilkar={behandlingspunktVilkar}
            featureToggles={featureToggles}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.TILKJENT_YTELSE}
        data={tilkjentYtelseData}
        render={(props) => (
          <TilkjentYtelseProsessIndex
            fagsak={fagsakInfo}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            readOnly={readOnly}
            submitCallback={submitCallback}
            readOnlySubmitButton={readOnlySubmitButton}
            alleKodeverk={alleKodeverk}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.UTTAK || uttakAksjonspunkter.some((ap) => apCodes.includes(ap))}
        data={uttakData}
        render={(props) => (
          <UttakProsessIndex
            fagsak={fagsakInfo}
            submitCallback={submitCallback}
            readOnly={readOnly}
            aksjonspunkter={behandlingspunktAksjonspunkter}
            readOnlySubmitButton={readOnlySubmitButton}
            apCodes={apCodes}
            alleKodeverk={alleKodeverk}
            employeeHasAccess={kanOverstyreAccess.employeeHasAccess}
            tempUpdateStonadskontoer={tempUpdate}
            isApOpen={openAksjonspunkt}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.AVREGNING}
        data={avregningData}
        render={(props) => (
          <AvregningProsessIndex
            fagsak={fagsakInfo}
            featureToggles={featureToggles}
            submitCallback={submitCallback}
            readOnly={readOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            apCodes={apCodes}
            isApOpen={openAksjonspunkt}
            previewCallback={previewFptilbakeCallback}
            {...props}
          />
        )}
      />

      <DataFetcherWithCache
        behandlingVersjon={1}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.SOEKNADSFRIST
            && fagsakInfo.ytelseType.kode !== fagsakYtelseType.ENGANGSSTONAD}
        data={soknadsfristData}
        render={(props) => (
          <VurderSoknadsfristForeldrepengerIndex
            aksjonspunkter={behandlingspunktAksjonspunkter}
            submitCallback={submitCallback}
            readOnly={readOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            isApOpen={openAksjonspunkt}
            {...props}
          />
        )}
      />
    </div>
  </div>
);

BehandlingspunktInfoPanel.propTypes = {
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewFptilbakeCallback: PropTypes.func.isRequired,
  dispatchSubmitFailed: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  overrideReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  alleAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  fagsakInfo: PropTypes.shape().isRequired,
  featureToggles: PropTypes.shape().isRequired,
  kanOverstyreAccess: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  behandlingspunktVilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tempUpdate: PropTypes.func.isRequired,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  selectedBehandlingspunkt: behandlingsprosessSelectors.getSelectedBehandlingspunkt(state),
  behandlingspunktAksjonspunkter: behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  alleAksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingsprosessSelectors.getNotAcceptedByBeslutter(state),
  overrideReadOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktOverrideReadOnly(state),
  kanOverstyreAccess: behandlingSelectors.getRettigheter(state).kanOverstyreAccess,
  alleKodeverk: getAlleKodeverk(state),
  fagsakInfo: getFagsakInfo(state),
  featureToggles: getFeatureToggles(state),
  behandlingspunktVilkar: behandlingsprosessSelectors.getSelectedBehandlingspunktVilkar(state),
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    toggleBehandlingspunktOverstyring,
    tempUpdate: tempUpdateStonadskontoer,
  }, dispatch),
});

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps,
  toggleOverstyring: () => dispatchProps.toggleBehandlingspunktOverstyring(
    ownProps.selectedBehandlingspunkt,
  ),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(BehandlingspunktInfoPanel);
