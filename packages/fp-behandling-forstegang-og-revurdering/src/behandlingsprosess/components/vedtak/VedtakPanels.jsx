import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import behandlingSelectors from 'behandlingForstegangOgRevurdering/src/selectors/forsteOgRevBehandlingSelectors';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import VedtakForm from './VedtakForm';
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
  submitCallback,
  behandlingTypeKode,
}) => {
  if (behandlingspunkt === behandlingspunktCodes.VEDTAK) {
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
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  behandlingTypeKode: behandlingSelectors.getBehandlingType(state).kode,
});

export default connect(mapStateToProps)(VedtakPanels);
