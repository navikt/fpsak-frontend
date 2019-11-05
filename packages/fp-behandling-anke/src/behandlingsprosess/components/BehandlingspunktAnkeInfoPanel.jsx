import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classnames from 'classnames/bind';

import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import AnkeResultatProsessIndex from '@fpsak-frontend/prosess-anke-resultat';

import behandlingspunktAnkeSelectors from '../selectors/behandlingsprosessAnkeSelectors';
import behandlingSelectors from '../../selectors/ankeBehandlingSelectors';
import fpAnkeApi from '../../data/ankeBehandlingApi';
import BehandleAnkeForm from './ankebehandling/BehandleAnkeForm';
import BehandleMerknaderForm from './merknader/BehandleMerknaderForm';
import DataFetcherWithCacheTemp from '../../DataFetcherWithCacheTemp';

import styles from './behandlingspunktAnkeInfoPanel.less';

const classNames = classnames.bind(styles);

const resultatData = [fpAnkeApi.BEHANDLING, fpAnkeApi.ANKE_VURDERING];

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
  innstilling,
  behandlingspunktAksjonspunkter,
}) => (
  <div className={classNames('behandlingsPunkt', { notAcceptedByBeslutter, statusAksjonspunkt: openAksjonspunkt && isApSolvable && !readOnly })}>
    {behandlingspunktCodes.ANKEBEHANDLING === selectedBehandlingspunkt
    && (
      <BehandleAnkeForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        saveAnke={saveTempAnke}
        previewCallback={previewCallback}
        previewVedtakCallback={previewCallbackAnke}
        readOnlySubmitButton={readOnlySubmitButton}
        innstilling={innstilling}
      />
    )}
    {behandlingspunktCodes.ANKE_MERKNADER === selectedBehandlingspunkt
    && (
      <BehandleMerknaderForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        saveAnke={saveTempAnke}
        previewCallback={previewCallback}
        previewVedtakCallback={previewCallbackAnke}
        readOnlySubmitButton={readOnlySubmitButton}
      />
    )}

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
  innstilling: PropTypes.shape({}),
  behandlingspunktAksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

BehandlingspunktAnkeInfoPanel.defaultProps = {
  notAcceptedByBeslutter: false,
  innstilling: {},
};

const mapStateToProps = (state) => ({
  openAksjonspunkt: behandlingspunktAnkeSelectors.hasBehandlingspunktAtLeastOneOpenAksjonspunkt(state),
  readOnly: behandlingspunktAnkeSelectors.isSelectedBehandlingspunktReadOnly(state),
  isApSolvable: behandlingspunktAnkeSelectors.isBehandlingspunktAksjonspunkterSolvable(state),
  readOnlySubmitButton: behandlingspunktAnkeSelectors.isBehandlingspunkterAksjonspunkterNotSolvableOrVilkarIsOppfylt(state),
  notAcceptedByBeslutter: behandlingspunktAnkeSelectors.getNotAcceptedByBeslutter(state),
  behandlingspunktAksjonspunkter: behandlingspunktAnkeSelectors.getSelectedBehandlingspunktAksjonspunkter(state),
  innstilling: behandlingSelectors.getBehandlingAnkeVurderingResultat(state),
});

export default connect(mapStateToProps)(BehandlingspunktAnkeInfoPanel);
