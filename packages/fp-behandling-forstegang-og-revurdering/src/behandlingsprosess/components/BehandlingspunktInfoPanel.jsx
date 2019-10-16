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
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';

import { toggleBehandlingspunktOverstyring } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/duckBpForstegangOgRev';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import { getFeatureToggles, getFagsakInfo, getAlleKodeverk } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import DataFetcherWithCache from '../../DataFetcherWithCache';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

const avregningData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.SIMULERING_RESULTAT, fpsakApi.TILBAKEKREVINGVALG];
const beregningsgrunnlagData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.BEREGNINGSGRUNNLAG];
const beregningsresultatData = [fpsakApi.BEHANDLING, fpsakApi.BEREGNINGRESULTAT_ENGANGSSTONAD];
const revurderingData = [fpsakApi.BEHANDLING, fpsakApi.FAMILIEHENDELSE, fpsakApi.SOKNAD, fpsakApi.ORIGINAL_BEHANDLING];
const sjekkPersonStatusData = [fpsakApi.BEHANDLING, fpsakApi.MEDLEMSKAP, fpsakApi.PERSONOPPLYSNINGER];
const soknadsfristData = [fpsakApi.BEHANDLING, fpsakApi.UTTAK_PERIODE_GRENSE, fpsakApi.SOKNAD];


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
  toggleOverstyring,
  alleKodeverk,
  behandlingspunktVilkar,
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
      <VedtakPanels
        behandlingspunkt={selectedBehandlingspunkt}
        readOnly={readOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
      />

      {selectedBehandlingspunkt === behandlingspunktCodes.BEREGNING && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
      )}

      {selectedBehandlingspunkt === behandlingspunktCodes.SAKSOPPLYSNINGER && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
      )}

      {selectedBehandlingspunkt === behandlingspunktCodes.VARSEL && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
      )}
      {selectedBehandlingspunkt === behandlingspunktCodes.BEREGNINGSGRUNNLAG && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
              {...props}
            />
          )}
        />
      )}

      {TilkjentYtelsePanel.supports(selectedBehandlingspunkt)
      && (
      <TilkjentYtelsePanel
        readOnly={readOnly}
        submitCallback={submitCallback}
        readOnlySubmitButton={readOnlySubmitButton}
      />
      )}
      {UttakPanel.supports(selectedBehandlingspunkt, apCodes)
      && (
      <UttakPanel
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        apCodes={apCodes}
        isApOpen={openAksjonspunkt}
      />
      )}
      {selectedBehandlingspunkt === behandlingspunktCodes.AVREGNING && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
      )}

      {(selectedBehandlingspunkt === behandlingspunktCodes.SOEKNADSFRIST
        && fagsakInfo.ytelseType.kode !== fagsakYtelseType.ENGANGSSTONAD) && (
        <DataFetcherWithCache
          behandlingVersjon={1}
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
      )}
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
  notAcceptedByBeslutter: PropTypes.bool,
  fagsakInfo: PropTypes.shape().isRequired,
  featureToggles: PropTypes.shape().isRequired,
  kanOverstyreAccess: PropTypes.shape().isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  toggleOverstyring: PropTypes.func.isRequired,
  behandlingspunktVilkar: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  selectedBehandlingspunkt: behandlingsprosessSelectors.getSelectedBehandlingspunkt(state),
  behandlingspunktAksjonspunkter: behandlingsprosessSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
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
