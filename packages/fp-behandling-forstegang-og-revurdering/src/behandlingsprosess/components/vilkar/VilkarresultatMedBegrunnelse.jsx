import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    getSelectedBehandlingspunktAksjonspunkter,
    getSelectedBehandlingspunkt,
    isSelectedBehandlingspunktOverrideReadOnly,
  } from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/behandlingsprosessSelectors';
import { getKodeverk, isForeldrepengerFagsak } from 'behandlingForstegangOgRevurdering/src/duck';
import VilkarResultPicker from 'behandlingForstegangOgRevurdering/src/behandlingsprosess/components/vilkar/VilkarResultPicker';
import VilkarBegrunnelse from '../VilkarBegrunnelse';
import { getApCode } from './BehandlingspunktToAksjonspunkt';


const getRelevanteAvslagsarsaker = (vilkarTypeKode, state) => {
  const vilkartypeAvslagsarsaker = getKodeverk(kodeverkTyper.AVSLAGSARSAK)(state)[vilkarTypeKode];
  if (vilkarTypeKode === vilkarType.FODSELSVILKARET_MOR) {
      return getFodselVilkarAvslagsarsaker(isForeldrepengerFagsak(state), vilkartypeAvslagsarsaker);
  }
  return vilkartypeAvslagsarsaker;
};

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
  <React.Fragment>
    {skalViseBegrunnelse
        && <VilkarBegrunnelse isReadOnly={readOnly} />
    }
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
      customVilkarOppfyltText={customVilkarOppfyltText}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      hasAksjonspunkt={hasAksjonspunkt}
      behandlingspunkt={behandlingspunkt}
    />
  </React.Fragment>
);


VilkarresultatMedBegrunnelse.propTypes = {
  erVilkarOk: PropTypes.bool,
  readOnly: PropTypes.bool,
  behandlingspunkt: PropTypes.shape(),
  hasAksjonspunkt: PropTypes.bool,
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
  behandlingspunkt: undefined,
  erVilkarOk: undefined,
  readOnly: false,
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  hasAksjonspunkt: false,
  skalViseBegrunnelse: true,
};

VilkarresultatMedBegrunnelse.buildInitialValues = (behandlingsresultat, aksjonspunkter, status,
  behandlingspunkt, ytelseType, allVilkar) => {
    const apCode = getApCode(behandlingspunkt, ytelseType, allVilkar);
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
    return {
      ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
      ...VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
    };
};

VilkarresultatMedBegrunnelse.validate = values => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);


const mapStateToPropsFactory = (initialState) => {
  const behandlingspunkt = getSelectedBehandlingspunkt(initialState);

  return (state) => {
    const aksjonspunkter = getSelectedBehandlingspunktAksjonspunkter(state);
    const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === apCode);
    const vilkar = getVilkar(state);

    return {
      behandlingspunkt,
      customVilkarIkkeOppfyltText,
      customVilkarOppfyltText,
      hasAksjonspunkt: aksjonspunkt !== undefined,
      avslagsarsaker: getRelevanteAvslagsarsaker(vilkar.vilkarType.kode, state),
      isReadOnly: isSelectedBehandlingspunktOverrideReadOnly(state),
    };
  };
};


export default connect(mapStateToPropsFactory)(VilkarresultatMedBegrunnelse);
