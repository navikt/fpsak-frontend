import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from 'behandlingAnke/src/selectors/ankeBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingAnke/src/duckAnke';
import { getOpenInfoPanels, resetFakta } from './duckFaktaAnke';
import FaktaAnkePanel from './components/FaktaAnkePanel';

/**
 * FaktaAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Anke.
 */
export const FaktaAnkeContainer = ({
  faktaIndexProps,
}) => (
  <FaktaAnkePanel faktaIndexProps={faktaIndexProps} />
);

FaktaAnkeContainer.propTypes = {
  faktaIndexProps: PropTypes.instanceOf(FaktaIndexProps).isRequired,
};

const mapStateToProps = state => ({
  faktaIndexProps: new FaktaIndexProps(
    getBehandlingIdentifier(state),
    getBehandlingVersjon(state),
    getOpenInfoPanels(state),
    resetFakta,
  ),
});

export default connect(mapStateToProps)(FaktaAnkeContainer);
