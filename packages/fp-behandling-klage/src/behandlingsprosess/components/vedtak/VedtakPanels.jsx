import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBehandlingType } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import VedtakKlageForm from './klage/VedtakKlageForm';
import VedtakKlageFormNy from './klageNy/VedtakKlageForm';

// TODO (TOR) Refaktorer vedtak og flytt felles komponentar til fp-behandling-felles

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  behandlingspunkt,
  readOnly,
  previewVedtakCallback,
  previewKlageBrevCallback,
  submitCallback,
  behandlingTypeKode,
  featureToggleFormkrav,
}) => {
  if (behandlingspunkt === behandlingspunktCodes.VEDTAK || behandlingspunkt === behandlingspunktCodes.KLAGE_RESULTAT) {
    if (behandlingTypeKode === behandlingType.KLAGE && !featureToggleFormkrav) {
      return (
        <VedtakKlageForm
          submitCallback={submitCallback}
          previewVedtakCallback={previewVedtakCallback}
          readOnly={readOnly}
        />
      );
    }
    if (behandlingTypeKode === behandlingType.KLAGE && featureToggleFormkrav) {
      return (
        <VedtakKlageFormNy
          submitCallback={submitCallback}
          previewVedtakCallback={previewKlageBrevCallback}
          readOnly={readOnly}
        />
      );
    }
  }
  return null;
};

VedtakPanels.propTypes = {
  behandlingspunkt: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewKlageBrevCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  featureToggleFormkrav: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  behandlingTypeKode: getBehandlingType(state).kode,
  featureToggleFormkrav: true,
});

export default connect(mapStateToProps)(VedtakPanels);
