import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import AvregningProsessIndex from '@fpsak-frontend/prosess-avregning';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingsprosessSelectors from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/selectors/behandlingsprosessForstegangOgRevSelectors';
import fpsakApi from 'behandlingForstegangOgRevurdering/src/data/fpsakBehandlingApi';
import { getFeatureToggles, getFagsakInfo } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import CheckPersonStatusForm from './saksopplysninger/CheckPersonStatusForm';
import TilkjentYtelsePanel from './tilkjentYtelse/TilkjentYtelsePanel';
import UttakPanel from './uttak/UttakPanel';
import VedtakPanels from './vedtak/VedtakPanels';
import VilkarPanels from './vilkar/VilkarPanels';
import BeregningFP from './beregningsgrunnlag/BeregningFP';
import VarselOmRevurderingForm from './revurdering/VarselOmRevurderingForm';
import BeregningsresultatEngangsstonadForm from './beregningsresultat/BeregningsresultatEngangsstonadForm';
import VurderSoknadsfristForeldrepengerForm from './soknadsfrist/VurderSoknadsfristForeldrepengerForm';
import DataFetcherWithCache from '../DataFetcherWithCache';

import styles from './behandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

const avregningData = [fpsakApi.BEHANDLING, fpsakApi.AKSJONSPUNKTER, fpsakApi.SIMULERING_RESULTAT, fpsakApi.TILBAKEKREVINGVALG];

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
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <VilkarPanels
        aksjonspunktCodes={apCodes}
        behandlingspunkt={selectedBehandlingspunkt}
        isAksjonspunktOpen={openAksjonspunkt}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        submitCallback={submitCallback}
      />
      <VedtakPanels
        behandlingspunkt={selectedBehandlingspunkt}
        readOnly={readOnly}
        previewCallback={previewCallback}
        submitCallback={submitCallback}
      />

      {BeregningsresultatEngangsstonadForm.supports(selectedBehandlingspunkt)
      && <BeregningsresultatEngangsstonadForm submitCallback={submitCallback} />}
      {CheckPersonStatusForm.supports(apCodes)
      && <CheckPersonStatusForm submitCallback={submitCallback} readOnly={readOnly} readOnlySubmitButton={readOnlySubmitButton} />}
      {VarselOmRevurderingForm.supports(apCodes)
      && (
      <VarselOmRevurderingForm
        submitCallback={submitCallback}
        previewCallback={previewCallback}
        dispatchSubmitFailed={dispatchSubmitFailed}
        readOnly={readOnly}
      />
      )}
      {BeregningFP.supports(selectedBehandlingspunkt)
      && (
      <BeregningFP
        readOnly={readOnly}
        submitCallback={submitCallback}
        apCodes={apCodes}
        readOnlySubmitButton={readOnlySubmitButton}
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
      {VurderSoknadsfristForeldrepengerForm.supports(apCodes)
      && (
      <VurderSoknadsfristForeldrepengerForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        readOnlySubmitButton={readOnlySubmitButton}
        isApOpen={openAksjonspunkt}
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
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  fagsakInfo: PropTypes.shape().isRequired,
  featureToggles: PropTypes.shape().isRequired,
};

BehandlingspunktInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingsprosessSelectors.getNotAcceptedByBeslutter(state),
  fagsakInfo: getFagsakInfo(state),
  featureToggles: getFeatureToggles(state),
});

export default connect(mapStateToProps)(BehandlingspunktInfoPanel);
