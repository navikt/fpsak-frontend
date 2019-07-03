import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FaktaIndexProps } from '@fpsak-frontend/fp-behandling-felles';

import { getBehandlingVersjon } from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { getBehandlingIdentifier } from 'behandlingInnsyn/src/duckInnsyn';
import { resetFakta, getOpenInfoPanels } from './duckFaktaInnsyn';

import FaktaInnsynPanel from './components/FaktaInnsynPanel';

/**
 * FaktaAnkeContainer
 *
 * Har ansvar for faktadelen av hovedvinduet når behandlingstypen er Innsyn.
 */
export const FaktaInnsynContainer = ({
  faktaIndexProps,
}) => (
  <FaktaInnsynPanel faktaIndexProps={faktaIndexProps} />
);

FaktaInnsynContainer.propTypes = {
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

export default connect(mapStateToProps)(FaktaInnsynContainer);
