import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { BehandlingIdentifier } from '@fpsak-frontend/fp-felles';

import MenuButton from '../MenuButton';

const submit = (resumeBehandling, behandlingIdentifier, selectedBehandlingVersjon, behandlingType, erPapirsoknad) => () => {
  resumeBehandling(behandlingIdentifier, {
    behandlingId: behandlingIdentifier.behandlingId,
    behandlingVersjon: selectedBehandlingVersjon,
  }, behandlingType, erPapirsoknad);
};

/**
 * ResumeBehandlingMenuItem
 *
 * Presentasjonskomponent. Viser menyinnslag for henlegging av behandling.
 * Håndterer også visning av modal.
 */
const ResumeBehandlingMenuItem = ({
  behandlingIdentifier,
  behandlingVersjon,
  resumeBehandling,
  gjenopptaBehandlingEnabled,
  behandlingType,
  erPapirsoknad,
}) => (
  <MenuButton
    onMouseDown={submit(resumeBehandling, behandlingIdentifier, behandlingVersjon, behandlingType, erPapirsoknad)}
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
  behandlingType: PropTypes.shape().isRequired,
  erPapirsoknad: PropTypes.bool.isRequired,
};

ResumeBehandlingMenuItem.defaultProps = {
  gjenopptaBehandlingEnabled: false,
  behandlingVersjon: undefined,
};

export default ResumeBehandlingMenuItem;
