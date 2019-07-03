import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingKlage/src/duckKlage';
import { resetFakta, getOpenInfoPanels } from './duckFaktaKlage';

import FaktaKlagePanel from './components/FaktaKlagePanel';

/**
 * FaktaAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const FaktaKlageContainer = ({
  faktaIndexProps,
}) => (
  <FaktaKlagePanel faktaIndexProps={faktaIndexProps} />
);

FaktaKlageContainer.propTypes = {
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

export default connect(mapStateToProps)(FaktaKlageContainer);
