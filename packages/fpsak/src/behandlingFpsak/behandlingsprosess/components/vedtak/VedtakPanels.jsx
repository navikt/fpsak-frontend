import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBehandlingType } from 'behandlingFpsak/behandlingSelectors';
import behandlingspunktCodes from 'behandlingFpsak/behandlingsprosess/behandlingspunktCodes';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import VedtakForm from './VedtakForm';
import InnsynVedtakForm from './innsyn/InnsynVedtakForm';
import VedtakKlageForm from './klage/VedtakKlageForm';
import VedtakKlageFormNy from './klageNy/VedtakKlageForm';
import VedtakRevurderingForm from './revurdering/VedtakRevurderingForm';

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  behandlingspunkt,
  readOnly,
  previewVedtakCallback,
  previewManueltBrevCallback,
  previewCallback,
  submitCallback,
  behandlingTypeKode,
  featureToggleFormkrav,
}) => {
  if (behandlingspunkt === behandlingspunktCodes.VEDTAK || behandlingspunkt === behandlingspunktCodes.KLAGE_RESULTAT) {
    if (behandlingTypeKode === behandlingType.DOKUMENTINNSYN) {
      return (
        <InnsynVedtakForm
          submitCallback={submitCallback}
          previewCallback={previewCallback}
          readOnly={readOnly}
        />
      );
    }
    if (behandlingTypeKode === behandlingType.REVURDERING) {
      return (
        <VedtakRevurderingForm
          submitCallback={submitCallback}
          previewVedtakCallback={previewVedtakCallback}
          previewManueltBrevCallback={previewManueltBrevCallback}
          readOnly={readOnly}
        />
      );
    }

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
          previewVedtakCallback={previewVedtakCallback}
          readOnly={readOnly}
        />
      );
    }

    return (
      <VedtakForm
        submitCallback={submitCallback}
        readOnly={readOnly}
        previewVedtakCallback={previewVedtakCallback}
        previewManueltBrevCallback={previewManueltBrevCallback}
      />
    );
  }
  return null;
};

VedtakPanels.propTypes = {
  behandlingspunkt: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  previewVedtakCallback: PropTypes.func.isRequired,
  previewManueltBrevCallback: PropTypes.func.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
  featureToggleFormkrav: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  behandlingTypeKode: getBehandlingType(state).kode,
  featureToggleFormkrav: true,
});

export default connect(mapStateToProps)(VedtakPanels);
