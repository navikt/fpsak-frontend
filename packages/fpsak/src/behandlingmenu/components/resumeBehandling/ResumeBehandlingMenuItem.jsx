import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import BehandlingIdentifier from 'behandling/BehandlingIdentifier';
import MenuButton from '../MenuButton';

const submit = (resumeBehandling, behandlingIdentifier, selectedBehandlingVersjon) => () => {
  resumeBehandling(behandlingIdentifier, {
    behandlingId: behandlingIdentifier.behandlingId,
    behandlingVersjon: selectedBehandlingVersjon,
  });
};

/**
 * ResumeBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for henlegging av behandling.
 * Håndterer også visning av modal.
 */
export const ResumeBehandlingMenuItem = ({
  behandlingIdentifier,
  behandlingVersjon,
  resumeBehandling,
  gjenopptaBehandlingEnabled,
}) => (
  <MenuButton
    onMouseDown={submit(resumeBehandling, behandlingIdentifier, behandlingVersjon)}
    disabled={!gjenopptaBehandlingEnabled}
  >
    <FormattedMessage id="Behandlingsmeny.ResumeBehandling" />
  </MenuButton>
);

ResumeBehandlingMenuItem.propTypes = {
  behandlingIdentifier: PropTypes.instanceOf(BehandlingIdentifier).isRequired,
  behandlingVersjon: PropTypes.number,
  resumeBehandling: PropTypes.func.isRequired,
  gjenopptaBehandlingEnabled: PropTypes.bool,
};

ResumeBehandlingMenuItem.defaultProps = {
  gjenopptaBehandlingEnabled: false,
  behandlingVersjon: undefined,
};

export default ResumeBehandlingMenuItem;
