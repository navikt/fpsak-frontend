import React from 'react';
import PropTypes from 'prop-types';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';


export const transformValuesForATFLISammeOrg = (inntektVerdier, faktaOmBeregning, fastsatteAndelsnr) => {
  if (faktaOmBeregning.faktaOmBeregningTilfeller.map(({ kode }) => kode).includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)
  && inntektVerdier) {
    const andelsliste = inntektVerdier
      .filter((field) => !fastsatteAndelsnr.includes(field.andelsnr))
      .filter((field) => faktaOmBeregning.arbeidstakerOgFrilanserISammeOrganisasjonListe.map(({ andelsnr }) => andelsnr).includes(field.andelsnr))
      .map((field) => ({
        andelsnr: field.andelsnr,
        arbeidsinntekt: field.fastsattBelop,
      }));


    if (faktaOmBeregning.frilansAndel && !fastsatteAndelsnr.includes(faktaOmBeregning.frilansAndel.andelsnr) && inntektVerdier) {
      const frilansVerdi = inntektVerdier.find((verdi) => verdi.andelsnr === faktaOmBeregning.frilansAndel.andelsnr);
      andelsliste.push({
        andelsnr: faktaOmBeregning.frilansAndel.andelsnr,
        arbeidsinntekt: frilansVerdi.fastsattBelop,
      });
    }
    andelsliste.forEach((andel) => fastsatteAndelsnr.push(andel.andelsnr));
    if (andelsliste.length > 0) {
      return {
        faktaOmBeregningTilfeller: [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON],
        vurderATogFLiSammeOrganisasjon: { vurderATogFLiSammeOrganisasjonAndelListe: andelsliste },
      };
    }
  }
  return { faktaOmBeregningTilfeller: [] };
};


export const ATFLSammeOrgTekst = ({ tilfeller, manglerInntektsmelding }) => {
  if (!tilfeller.includes(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON)) {
    return null;
  }
  if (manglerInntektsmelding) {
    return (
      <Normaltekst>
        <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrgUtenIM" />
      </Normaltekst>
    );
  }
  return (
    <Normaltekst>
      <FormattedMessage id="BeregningInfoPanel.VurderOgFastsettATFL.ATFLSammeOrg" />
    </Normaltekst>
  );
};

ATFLSammeOrgTekst.propTypes = {
  tilfeller: PropTypes.arrayOf(PropTypes.string).isRequired,
  manglerInntektsmelding: PropTypes.bool.isRequired,
};
