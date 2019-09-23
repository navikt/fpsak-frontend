import React from 'react';
import PropTypes from 'prop-types';

import { VilkarBegrunnelse } from '@fpsak-frontend/fp-felles';

import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import { getApCode } from './BehandlingspunktToAksjonspunkt';


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
  behandlingspunkt,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
}) => (
  <>
    {skalViseBegrunnelse
        && <VilkarBegrunnelse isReadOnly={readOnly} />}
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
      customVilkarOppfyltText={customVilkarOppfyltText}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      behandlingspunkt={behandlingspunkt}
    />
  </>
);


VilkarresultatMedBegrunnelse.propTypes = {
  erVilkarOk: PropTypes.bool.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingspunkt: PropTypes.string.isRequired,
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
  skalViseBegrunnelse: true,
};

VilkarresultatMedBegrunnelse.buildInitialValues = (behandlingsresultat, aksjonspunkter, status,
  behandlingspunkt, ytelseType, allVilkar) => {
  const apCode = getApCode(behandlingspunkt, ytelseType, allVilkar);
  const aksjonspunkt = aksjonspunkter.find((ap) => ap.definisjon.kode === apCode);
  return {
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
  };
};

VilkarresultatMedBegrunnelse.validate = (values) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
