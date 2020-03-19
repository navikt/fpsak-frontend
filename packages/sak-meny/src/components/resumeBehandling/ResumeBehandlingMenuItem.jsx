import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import MenuButton from '../MenuButton';

const submit = (resumeBehandling, behandlingId, selectedBehandlingVersjon) => () => {
  resumeBehandling({
    behandlingId,
    behandlingVersjon: selectedBehandlingVersjon,
  });
};

/**
 * ResumeBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for henlegging av behandling.
 * Håndterer også visning av modal.
 */
const ResumeBehandlingMenuItem = ({
  behandlingId,
  behandlingVersjon,
  resumeBehandling,
  gjenopptaBehandlingEnabled,
}) => (
  <MenuButton
    onMouseDown={submit(resumeBehandling, behandlingId, behandlingVersjon)}
    disabled={!gjenopptaBehandlingEnabled}
  >
    <FormattedMessage id="Behandlingsmeny.ResumeBehandling" />
  </MenuButton>
);

ResumeBehandlingMenuItem.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number,
  resumeBehandling: PropTypes.func.isRequired,
  gjenopptaBehandlingEnabled: PropTypes.bool,
};

ResumeBehandlingMenuItem.defaultProps = {
  gjenopptaBehandlingEnabled: false,
  behandlingVersjon: undefined,
};

export default ResumeBehandlingMenuItem;
