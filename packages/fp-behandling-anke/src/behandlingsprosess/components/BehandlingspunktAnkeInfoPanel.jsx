import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';
import AnkeProsessIndex from '@fpsak-frontend/prosess-anke';
import AnkeMerknaderProsessIndex from '@fpsak-frontend/prosess-anke-merknader';

import { getFagsakBehandlingerInfo } from '../../duckBehandlingAnke';
import behandlingspunktAnkeSelectors from '../selectors/behandlingsprosessAnkeSelectors';
import fpAnkeApi from '../../data/ankeBehandlingApi';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

import styles from './behandlingspunktAnkeInfoPanel.less';

const classNames = classnames.bind(styles);

const ankeData = [fpAnkeApi.BEHANDLING, fpAnkeApi.ANKE_VURDERING];
const resultatData = [fpAnkeApi.BEHANDLING, fpAnkeApi.ANKE_VURDERING];
const merknaderData = [fpAnkeApi.BEHANDLING, fpAnkeApi.ANKE_VURDERING];

/*
 * BehandlingspunktAnkeInfoPanel
 *
 * Presentasjonskomponent. Viser panel gitt valgt behandlingspunkt. Finnes det en aksjonspunktkode blir denne
 * brukt til å velge panel. Finnes det ikke aksjonspunkter blir enten beregning, vedtak eller vilkårsresultatet vist.
 */
export const BehandlingspunktAnkeInfoPanel = ({ // NOSONAR Kompleksitet er høg, men det er likevel lesbart
  selectedBehandlingspunkt,
  saveTempAnke,
  submitCallback,
  previewCallback,
  previewCallbackAnke,
  openAksjonspunkt,
  readOnly,
  isApSolvable,
  readOnlySubmitButton,
  notAcceptedByBeslutter,
  behandlingspunktAksjonspunkter,
  behandlinger,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={ankeData}
      showComponent={behandlingspunktCodes.ANKEBEHANDLING === selectedBehandlingspunkt}
      render={(props) => (
        <AnkeProsessIndex
          behandlinger={behandlinger}
          aksjonspunkter={behandlingspunktAksjonspunkter}
          submitCallback={submitCallback}
          readOnly={readOnly}
          saveAnke={saveTempAnke}
          previewCallback={previewCallback}
          previewVedtakCallback={previewCallbackAnke}
          readOnlySubmitButton={readOnlySubmitButton}
          {...props}
        />
      )}
    />

    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={merknaderData}
      showComponent={behandlingspunktCodes.ANKE_MERKNADER === selectedBehandlingspunkt}
      render={(props) => (
        <AnkeMerknaderProsessIndex
          aksjonspunkter={behandlingspunktAksjonspunkter}
          submitCallback={submitCallback}
          readOnly={readOnly}
          saveAnke={saveTempAnke}
          previewCallback={previewCallback}
          previewVedtakCallback={previewCallbackAnke}
          readOnlySubmitButton={readOnlySubmitButton}
          {...props}
        />
      )}
    />

    <DataFetcherWithCacheTemp
      behandlingVersjon={1}
      data={resultatData}
      showComponent={behandlingspunktCodes.ANKE_RESULTAT === selectedBehandlingspunkt}
      render={(props) => (
        <AnkeResultatProsessIndex
          aksjonspunkter={behandlingspunktAksjonspunkter}
          submitCallback={submitCallback}
          readOnly={readOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          saveAnke={saveTempAnke}
          previewCallback={previewCallback}
          previewVedtakCallback={previewCallbackAnke}
          {...props}
        />
      )}
    />
  </div>
);

BehandlingspunktAnkeInfoPanel.propTypes = {
  saveTempAnke: PropTypes.func.isRequired,
  selectedBehandlingspunkt: PropTypes.string.isRequired,
  submitCallback: PropTypes.func.isRequired,
  openAksjonspunkt: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  previewCallbackAnke: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  isApSolvable: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  notAcceptedByBeslutter: PropTypes.bool,
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  behandlinger: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    opprettet: PropTypes.string,
    type: PropTypes.shape({
      kode: PropTypes.string,
    }),
    status: PropTypes.shape({
      kode: PropTypes.string,
    }),
  })).isRequired,
};

BehandlingspunktAnkeInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingspunktAnkeSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktAnkeSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktAnkeSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  readOnlySubmitButton: behandlingspunktAnkeSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktAnkeSelectors.getNotAcceptedByBeslutter(state),
  behandlingspunktAksjonspunkter: behandlingspunktAnkeSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  behandlinger: getFagsakBehandlingerInfo(state),
});

export default connect(mapStateToProps)(BehandlingspunktAnkeInfoPanel);
