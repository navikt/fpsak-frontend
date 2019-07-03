import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from 'behandlingTilbakekreving/src/selectors/tilbakekrevingBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingTilbakekreving/src/duckTilbake';
import {
  resetFakta, resolveFaktaAksjonspunkter, getOpenInfoPanels,
} from './duckFaktaTilbake';
import TilbakekrevingFaktaPanel from './components/TilbakekrevingFaktaPanel';

/**
 * FaktaTilbakeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet for Tilbakekreving.
 */
export const FaktaTilbakeContainer = ({
  faktaIndexProps,
}) => (
  <TilbakekrevingFaktaPanel faktaIndexProps={faktaIndexProps} />
);

FaktaTilbakeContainer.propTypes = {
  faktaIndexProps: PropTypes.instanceOf(FaktaIndexProps).isRequired,
};

const mapStateToProps = state => ({
  faktaIndexProps: new FaktaIndexProps(
    getBehandlingIdentifier(state),
    getBehandlingVersjon(state),
    getOpenInfoPanels(state),
    resetFakta,
    resolveFaktaAksjonspunkter,
  ),
});

export default connect(mapStateToProps)(FaktaTilbakeContainer);
