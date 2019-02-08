import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getBehandlingType } from 'behandlingInnsyn/src/selectors/innsynBehandlingSelectors';
import { behandlingspunktCodes } from '@fpsak-frontend/fp-felles';
import behandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import InnsynVedtakForm from './innsyn/InnsynVedtakForm';


// TODO (TOR) Refaktorer vedtak og flytt felles komponentar til fp-behandling-felles

/*
 * VedtakPanels
 *
 * Presentasjonskomponent.
 */
const VedtakPanels = ({
  behandlingspunkt,
  readOnly,
  previewCallback,
  submitCallback,
  behandlingTypeKode,
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
  }
  return null;
};

VedtakPanels.propTypes = {
  behandlingspunkt: PropTypes.string.isRequired,
  readOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  behandlingTypeKode: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  behandlingTypeKode: getBehandlingType(state).kode,
});

export default connect(mapStateToProps)(VedtakPanels);
