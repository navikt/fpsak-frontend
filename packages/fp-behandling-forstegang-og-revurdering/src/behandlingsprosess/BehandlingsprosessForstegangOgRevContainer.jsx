import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { kodeverkObjektPropType, aksjonspunktPropType } from '@fpsak-frontend/prop-types';
import { behandlingspunktCodes, BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import { getBehandlingIdentifier, getFagsakYtelseType } from 'behandlingForstegangOgRevurdering/src/duckBehandlingForstegangOgRev';
import statusIconsBeregningsgrunnlag from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsBeregningsgrunnlag';
import statusIconsUttak from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsUttak';
import statusIconsAvregning from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/statusIconsAvregning';
import behandlingSelectors from '../selectors/forsteOgRevBehandlingSelectors';
import {
  resolveProsessAksjonspunkter, overrideProsessAksjonspunkter, resetBehandlingspunkter, fetchPreviewBrev, getResolveProsessAksjonspunkterSuccess,
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
export const BehandlingsprosessForstegangOgRevContainer = props => (
  <BehandlingsprosessForstegangOgRevIndex
    additionalBehandlingspunktImages={additionalBehandlingspunktImages}
    doNotUseIverksetterVedtakModal
    {...props}
  />
);

BehandlingsprosessForstegangOgRevContainer.propTypes = {
  fagsakYtelseType: kodeverkObjektPropType.isRequired,
  isSelectedBehandlingHenlagt: PropTypes.bool.isRequired,
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  behandlingspunkter: PropTypes.arrayOf(PropTypes.string),
  selectedBehandlingspunkt: PropTypes.string,
  resolveProsessAksjonspunkterSuccess: PropTypes.bool.isRequired,
  behandlingStatus: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
  getBehandlingspunkterStatus: PropTypes.func.isRequired,
  getBehandlingspunkterTitleCodes: PropTypes.func.isRequired,
  getAksjonspunkterOpenStatus: PropTypes.func.isRequired,
  location: PropTypes.shape().isRequired,
  fetchPreviewBrev: PropTypes.func.isRequired,
  resolveProsessAksjonspunkter: PropTypes.func.isRequired,
  overrideProsessAksjonspunkter: PropTypes.func.isRequired,
  resetBehandlingspunkter: PropTypes.func.isRequired,
  behandlingType: kodeverkObjektPropType.isRequired,
  aksjonspunkter: PropTypes.arrayOf(aksjonspunktPropType).isRequired,
};

const mapStateToProps = state => ({
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
  getBehandlingspunkterStatus: behandlingspunktSelectors.getBehandlingspunkterStatus,
  getBehandlingspunkterTitleCodes: behandlingspunktSelectors.getBehandlingspunkterTitleCodes,
  getAksjonspunkterOpenStatus: behandlingspunktSelectors.getAksjonspunkterOpenStatus,
  location: state.router.location,
  fetchPreviewBrev,
  resolveProsessAksjonspunkter,
  overrideProsessAksjonspunkter,
  resetBehandlingspunkter,
});

export default connect(mapStateToProps)(BehandlingsprosessForstegangOgRevContainer);
