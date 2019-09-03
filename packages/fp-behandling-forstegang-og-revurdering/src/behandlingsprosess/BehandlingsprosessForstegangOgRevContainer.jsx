import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { aksjonspunktPropType, kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import { BehandlingIdentifier, behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import statusIconsBeregningsgrunnlag from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsBeregningsgrunnlag';
import statusIconsUttak from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsUttak';
import statusIconsAvregning from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsAvregning';
import behandlingSelectors from '../selectors/forsteOgRevBehandlingSelectors';
import {
  fetchPreviewBrev,
  getResolveProsessAksjonspunkterSuccess,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
  resolveProsessAksjonspunkter,
} from './duckBpForstegangOgRev';
import behandlingspunktSelectors from './selectors/behandlingsprosessForstegangOgRevSelectors';
import BehandlingsprosessForstegangOgRevIndex from './BehandlingsprosessForstegangOgRevIndex';


const additionalBehandlingspunktImages = {
  [behandlingspunktCodes.BEREGNINGSGRUNNLAG]: statusIconsBeregningsgrunnlag,
  [behandlingspunktCodes.UTTAK]: statusIconsUttak,
  [behandlingspunktCodes.AVREGNING]: statusIconsAvregning,
};

/**
 * BehandlingsprosessForstegangOgRevContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Førstegangsbehandling eller Revudering.
 */
export const BehandlingsprosessForstegangOgRevContainer = (props) => (
  <BehandlingsprosessForstegangOgRevIndex
    additionalBehandlingspunktImages={additionalBehandlingspunktImages}
    doNotUseIverksetterVedtakModal
    {...props}
  />
);

BehandlingsprosessForstegangOgRevContainer.propTypes = {
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
  aksjonspunkterOpenStatus: PropTypes.shape(),
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  behandlingspunkterStatus: PropTypes.shape(),
  behandlingspunkterTitleCodes: PropTypes.shape(),
  behandlingsresultat: PropTypes.shape(),
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  location: PropTypes.shape().isRequired,
  overrideProsessAksjonspunkter: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  selectedBehandlingspunkt: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fagsakYtelseType: getFagsakYtelseType(state),
  isSelectedBehandlingHenlagt: behandlingSelectors.getBehandlingHenlagt(state),
  behandlingIdentifier: getBehandlingIdentifier(state),
  behandlingVersjon: behandlingSelectors.getBehandlingVersjon(state),
  behandlingspunkter: behandlingspunktSelectors.getBehandlingspunkter(state),
  selectedBehandlingspunkt: behandlingspunktSelectors.getSelectedBehandlingspunkt(state),
  resolveProsessAksjonspunkterSuccess: getResolveProsessAksjonspunkterSuccess(state),
  behandlingStatus: behandlingSelectors.getBehandlingStatus(state),
  behandlingsresultat: behandlingSelectors.getBehandlingsresultat(state),
  behandlingType: behandlingSelectors.getBehandlingType(state),
  aksjonspunkter: behandlingSelectors.getAksjonspunkter(state),
  behandlingspunkterStatus: behandlingspunktSelectors.getBehandlingspunkterStatus(state),
  behandlingspunkterTitleCodes: behandlingspunktSelectors.getBehandlingspunkterTitleCodes(state),
  aksjonspunkterOpenStatus: behandlingspunktSelectors.getAksjonspunkterOpenStatus(state),
  location: state.router.location,
  fetchPreviewBrev,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessForstegangOgRevContainer);
