import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import VedtakTilbakekrevingProsessIndex from '@fpsak-frontend/prosess-vedtak-klage';
import KlagevurderingProsessIndex from '@fpsak-frontend/prosess-klagevurdering';
import FormkravProsessIndex from '@fpsak-frontend/prosess-formkrav';

import { getAlleKodeverk, getAvsluttedeBehandlinger } from '../../duckBehandlingKlage';
import fpKlageApi from '../../data/klageBehandlingApi';
import behandlingspunktKlageSelectors from '../selectors/behandlingsprosessKlageSelectors';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

import styles from './behandlingspunktKlageInfoPanel.less';

const classNames = classnames.bind(styles);

const vedtakData = [fpKlageApi.BEHANDLING, fpKlageApi.KLAGE_VURDERING];
const klagevurderingData = [fpKlageApi.BEHANDLING, fpKlageApi.KLAGE_VURDERING];
const formkravData = [fpKlageApi.BEHANDLING, fpKlageApi.KLAGE_VURDERING];

/*
 * BehandlingspunktKlageInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktKlageInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  saveTempKlage,
  submitCallback,
  previewCallback,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  apCodes,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
  behandlingspunktAksjonspunkter,
  alleKodeverk,
  avsluttedeBehandlinger,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <div>
      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={vedtakData}
        showComponent={selectedBehandlingspunkt === behandlingspunktCodes.KLAGE_RESULTAT}
        render={(props) => (
          <VedtakTilbakekrevingProsessIndex
            aksjonspunkter={behandlingspunktAksjonspunkter}
            submitCallback={submitCallback}
            previewVedtakCallback={previewCallback}
            readOnly={readOnly}
            {...props}
          />
        )}
      />

      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={klagevurderingData}
        showComponent={apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NK)
          || apCodes.includes(aksjonspunktCodes.BEHANDLE_KLAGE_NFP)}
        render={(props) => (
          <KlagevurderingProsessIndex
            alleKodeverk={alleKodeverk}
            saveKlage={saveTempKlage}
            submitCallback={submitCallback}
            readOnly={readOnly}
            previewCallback={previewCallback}
            readOnlySubmitButton={readOnlySubmitButton}
            apCodes={apCodes}
            {...props}
          />
        )}
      />

      <DataFetcherWithCacheTemp
        behandlingVersjon={1}
        data={formkravData}
        showComponent={apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP)
          || apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA)}
        render={(props) => (
          <FormkravProsessIndex
            submitCallback={submitCallback}
            readOnly={readOnly}
            readOnlySubmitButton={readOnlySubmitButton}
            apCodes={apCodes}
            alleKodeverk={alleKodeverk}
            avsluttedeBehandlinger={avsluttedeBehandlinger}
            {...props}
          />
        )}
      />
    </div>
  </div>
);

BehandlingspunktKlageInfoPanel.propTypes = {
  saveTempKlage: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  apCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  alleKodeverk: PropTypes.shape().isRequired,
  avsluttedeBehandlinger: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

BehandlingspunktKlageInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingspunktKlageSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktKlageSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktKlageSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  apCodes: behandlingspunktKlageSelectors.getBehandlingspunktAksjonspunkterCodes(state),
  readOnlySubmitButton: behandlingspunktKlageSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktKlageSelectors.getNotAcceptedByBeslutter(state),
  behandlingspunktAksjonspunkter: behandlingspunktKlageSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  alleKodeverk: getAlleKodeverk(state),
  avsluttedeBehandlinger: getAvsluttedeBehandlinger(state),
});

export default connect(mapStateToProps)(BehandlingspunktKlageInfoPanel);
