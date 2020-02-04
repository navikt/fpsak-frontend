import React from 'react';
import PropTypes from 'prop-types';

import { VilkarBegrunnelse, VilkarResultPicker } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';

/**
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedBegrunnelse = ({
  erVilkarOk,
  readOnly,
  avslagsarsaker,
  hasAksjonspunkt,
  erMedlemskapsPanel,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
}) => (
  <>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
      customVilkarOppfyltText={customVilkarOppfyltText}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      erMedlemskapsPanel={erMedlemskapsPanel}
    />
    {skalViseBegrunnelse && (
      <>
        <VerticalSpacer eightPx />
        <VilkarBegrunnelse isReadOnly={readOnly} />
      </>
    )}
  </>
);


VilkarresultatMedBegrunnelse.propTypes = {
  erVilkarOk: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  erMedlemskapsPanel: PropTypes.bool.isRequired,
  hasAksjonspunkt: PropTypes.bool.isRequired,
  avslagsarsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string.isRequired,
    navn: PropTypes.string.isRequired,
  })).isRequired,
  customVilkarIkkeOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  customVilkarOppfyltText: PropTypes.shape({
    id: PropTypes.string.isRequired,
    values: PropTypes.shape(),
  }),
  skalViseBegrunnelse: PropTypes.bool,
};

VilkarresultatMedBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

VilkarresultatMedBegrunnelse.buildInitialValues = (behandlingsresultat, aksjonspunkter, status, overstyringApKode) => {
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === overstyringApKode);
  return {
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
  };
};

VilkarresultatMedBegrunnelse.transformValues = (values) => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (values = {}) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
