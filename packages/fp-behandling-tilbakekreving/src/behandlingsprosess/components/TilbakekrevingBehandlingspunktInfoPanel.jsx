import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames/bind';

import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-tilbakekreving';

import fptilbakeApi from 'behandlingTilbakekreving/src/data/tilbakekrevingBehandlingApi';
import tilbakekrevingAksjonspunktCodes from 'behandlingTilbakekreving/src/kodeverk/tilbakekrevingAksjonspunktCodes';
import DataFetcherWithCacheTemp from 'behandlingTilbakekreving/src/DataFetcherWithCacheTemp';
import {
  fetchPreviewVedtaksbrev as fetchPreviewVedtaksbrevActionCreator,
  getAlleTilbakekrevingKodeverk,
} from 'behandlingTilbakekreving/src/duckBehandlingTilbakekreving';
import behandlingSelectors from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import behandlingsprosessSelectors from '../selectors/behandlingsprosessTilbakeSelectors';
import ForeldelseForm from './foreldelse/ForeldelseForm';
import TilbakekrevingForm from './tilbakekreving/TilbakekrevingForm';

import styles from './tilbakekrevingBehandlingspunktInfoPanel.less';

const classNames = classnames.bind(styles);

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
}) => (
  <div className={classNames('behandlingsPunkt', { statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    {ForeldelseForm.supports(selectedBehandlingspunkt, apCodes) && (
    <ForeldelseForm
      submitCallback={submitCallback}
      apCodes={apCodes}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    )}
    {TilbakekrevingForm.supports(selectedBehandlingspunkt, apCodes) && (
    <TilbakekrevingForm
      submitCallback={submitCallback}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
    />
    )}

    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={vedtakData}
      showComponent={isBehandlingHenlagt || apCodes.some((ap) => ap === tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK)}
      render={(props) => (
        <VedtakTilbakekrevingProsessIndex
          submitCallback={submitCallback}
          readOnly={readOnly}
          isBehandlingHenlagt={isBehandlingHenlagt}
          alleKodeverk={alleKodeverk}
          fetchPreviewVedtaksbrev={fetchPreviewVedtaksbrev}
          aksjonspunktKodeForeslaVedtak={tilbakekrevingAksjonspunktCodes.FORESLA_VEDTAK}
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
};

const mapStateToProps = (state) => ({
  readOnlySubmitButton: behandlingsprosessSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  openAksjonspunkt: behandlingsprosessSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingsprosessSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingsprosessSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingsprosessSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  isBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  alleKodeverk: getAlleTilbakekrevingKodeverk(state),
});


const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    fetchPreviewVedtaksbrev: fetchPreviewVedtaksbrevActionCreator,
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(TilbakekrevingBehandlingspunktInfoPanel);
