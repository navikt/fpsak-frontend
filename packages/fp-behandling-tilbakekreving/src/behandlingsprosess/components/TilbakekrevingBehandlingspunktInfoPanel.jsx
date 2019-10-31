import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames/bind';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';
import TilbakekrevingProsessIndex from '@fpsak-frontend/prosess-tilbakekreving';
import ForeldelseProsessIndex from '@fpsak-frontend/prosess-foreldelse';
import aksjonspunktCodesTilbakekreving from '@fpsak-frontend/kodeverk/src/aksjonspunktCodesTilbakekreving';
import NavBrukerKjonn from '@fpsak-frontend/kodeverk/src/navBrukerKjonn';

import { beregnBeløp } from '../duckBpTilbake';
import fptilbakeApi from '../../data/tilbakekrevingBehandlingApi';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';
import {
  fetchPreviewVedtaksbrev as fetchPreviewVedtaksbrevActionCreator,
  getAlleTilbakekrevingKodeverk,
  getFagsakPerson,
} from '../../duckBehandlingTilbakekreving';
import behandlingSelectors from '../../selectors/tilbakekrevingBehandlingSelectors';
import behandlingsprosessSelectors from '../selectors/behandlingsprosessTilbakeSelectors';

import styles from './tilbakekrevingBehandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

const foreldelseData = [fptilbakeApi.BEHANDLING, fptilbakeApi.PERIODER_FORELDELSE];
const tilbakekrevingData = [fptilbakeApi.BEHANDLING, fptilbakeApi.PERIODER_FORELDELSE, fptilbakeApi.VILKARVURDERINGSPERIODER, fptilbakeApi.VILKARVURDERING];
const vedtakData = [fptilbakeApi.BEHANDLING, fptilbakeApi.VEDTAKSBREV, fptilbakeApi.BEREGNINGSRESULTAT];

/*
 * TilbakekrevingBehandlingspunktInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const TilbakekrevingBehandlingspunktInfoPanel = ({
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  submitCallback,
  selectedBehandlingspunkt,
  apCodes,
  readOnlySubmitButton,
  isBehandlingHenlagt,
  alleKodeverk,
  fetchPreviewVedtaksbrev,
  navBrukerKjonn,
  alleMerknaderFraBeslutter,
  beregnBelop,
}) => (
  <div className={classNames('behandlingsPunkt', { statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={foreldelseData}
      showComponent={selectedBehandlingspunkt === behandlingspunktCodes.FORELDELSE || apCodes.includes(aksjonspunktCodesTilbakekreving.VURDER_FORELDELSE)}
      render={(props) => (
        <ForeldelseProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          apCodes={apCodes}
          readOnlySubmitButton={readOnlySubmitButton}
          navBrukerKjonn={navBrukerKjonn}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          alleKodeverk={alleKodeverk}
          beregnBelop={beregnBelop}
          {...props}
        />
      )}
    />

    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={tilbakekrevingData}
      showComponent={selectedBehandlingspunkt === behandlingspunktCodes.TILBAKEKREVING
        || apCodes.includes(aksjonspunktCodesTilbakekreving.VURDER_TILBAKEKREVING)}
      render={(props) => (
        <TilbakekrevingProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          apCodes={apCodes}
          readOnlySubmitButton={readOnlySubmitButton}
          navBrukerKjonn={navBrukerKjonn}
          alleKodeverk={alleKodeverk}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
          beregnBelop={beregnBelop}
          {...props}
        />
      )}
    />

    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={vedtakData}
      showComponent={isBehandlingHenlagt || apCodes.some((ap) => ap === aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK)}
      render={(props) => (
        <VedtakTilbakekrevingProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          isBehandlingHenlagt={isBehandlingHenlagt}
          alleKodeverk={alleKodeverk}
          fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
          aksjonspunktKodeForeslaVedtak={aksjonspunktCodesTilbakekreving.FORESLA_VEDTAK}
          {...props}
        />
      )}
    />
  </div>
);

TilbakekrevingBehandlingspunktInfoPanel.propTypes = {
  openAksjonspunkt: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  submitCallback: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  isBehandlingHenlagt: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  fetchPreviewVedtaksbrev: PropTypes.func.isRequired,
  navBrukerKjonn: PropTypes.string.isRequired,
  alleMerknaderFraBeslutter: PropTypes.shape().isRequired,
  beregnBelop: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  isBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  alleKodeverk: getAlleTilbakekrevingKodeverk(state),
  navBrukerKjonn: getFagsakPerson(state).erKvinne ? NavBrukerKjonn.KVINNE : NavBrukerKjonn.MANN,
  alleMerknaderFraBeslutter: behandlingSelectors.getAllMerknaderFraBeslutter(state),
});


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    fetchPreviewVedtaksbrev: fetchPreviewVedtaksbrevActionCreator,
    beregnBelop: beregnBeløp,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilbakekrevingBehandlingspunktInfoPanel);
