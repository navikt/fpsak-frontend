import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBehandlingType } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import VedtakKlageFormNy from './klage/VedtakKlageForm';

// TODO (TOR) Refaktorer vedtak og flytt felles komponentar til fp-behandling-felles

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  behandlingspunkt,
  readOnly,
  previewKlageBrevCallback,
  submitCallback,
  behandlingTypeKode,
}) => {
  // Tror ikke denne skjekken trengs
  if (behandlingTypeKode === behandlingType.KLAGE && behandlingspunkt === behandlingspunktCodes.KLAGE_RESULTAT) {
    return (
      <VedtakKlageFormNy
        submitCallback={submitCallback}
        previewVedtakCallback={previewKlageBrevCallback}
        readOnly={readOnly}
      />
    );
  }
  return null;
};

VedtakPanels.propTypes = {
  behandlingspunkt: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  previewKlageBrevCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  behandlingTypeKode: getBehandlingType(state).kode,
});

export default connect(mapStateToProps)(VedtakPanels);
