import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { NavLink } from 'react-router-dom';
import { Element, Normaltekst } from 'nav-frontend-typografi';

import historikkinnslagDelPropType from 'behandling/proptypes/historikkinnslagDelPropType';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import VerticalSpacer from 'sharedComponents/VerticalSpacer';

import { createLocationForHistorikkItems } from 'app/paths';
import { findHendelseText } from './historikkUtils';

const aksjonspunktCodesToTextCode = {
  [aksjonspunktCodes.TERMINBEKREFTELSE]: 'TermindatoFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.ADOPSJONSDOKUMENTAJON]: 'DokumentasjonFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.OM_ADOPSJON_GJELDER_EKTEFELLES_BARN]: 'EktefelleFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.OM_SOKER_ER_MANN_SOM_ADOPTERER_ALENE]: 'MannAdoptererAleneFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.SOKNADSFRISTVILKARET]: 'ErSoknadsfristVilkaretOppfyltForm.ApplicationInformation',
  [aksjonspunktCodes.VURDER_SOKNADSFRIST_FORELDREPENGER]: 'ErSoknadsfristVilkaretOppfyltForm.ApplicationInformation',
  [aksjonspunktCodes.OMSORGSOVERTAKELSE]: 'OmsorgOgForeldreansvarInfoPanel.Omsorg',
  [aksjonspunktCodes.TILLEGGSOPPLYSNINGER]: 'TilleggsopplysningerInfoPanel.Tilleggsopplysninger',
  [aksjonspunktCodes.MEDLEMSKAP]: 'MedlemskapInfoPanel.Medlemskap',
  [aksjonspunktCodes.VURDER_PERIODER_MED_OPPTJENING]: 'Behandlingspunkt.Opptjeningsvilkaret',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_OMSORGSVILKARET]: 'OmsorgOgForeldreansvarFaktaForm.ApplicationInformation',
  [aksjonspunktCodes.REGISTRER_PAPIRSOKNAD_ENGANGSSTONAD]: 'Registrering.RegistrerePapirSoknadAksPkt',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_2_LEDD]: 'ErForeldreansvar2LeddVilkaarOppfyltForm.Foreldreansvar',
  [aksjonspunktCodes.MANUELL_VURDERING_AV_FORELDREANSVARSVILKARET_4_LEDD]: 'ErForeldreansvar4LeddVilkaarOppfyltForm.Foreldreansvar',
  [aksjonspunktCodes.VARSEL_REVURDERING_ETTERKONTROLL]: 'VarselOmRevurderingInfoPanel.Etterkontroll',
  [aksjonspunktCodes.VARSEL_REVURDERING_MANUELL]: 'VarselOmRevurderingInfoPanel.Manuell',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_GJELDER_SAMME_BARN]: 'HistorikkAksjonpunktMapping.SokersStonadGjelderSammeBarn',
  [aksjonspunktCodes.AVKLAR_OM_STONAD_TIL_ANNEN_FORELDER_GJELDER_SAMME_BARN]: 'HistorikkAksjonpunktMapping.AnnenForeldersStonadGjelderSammeBarn',
  [aksjonspunktCodes.AVKLAR_VERGE]: 'Verge.AvklarVerge',
  [aksjonspunktCodes.SJEKK_MANGLENDE_FODSEL]: 'SjekkFodselDokForm.ApplicationInformation',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NFP]: 'Klage.KlageNFP',
  [aksjonspunktCodes.BEHANDLE_KLAGE_NK]: 'Klage.KlageNK',
  [aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD]: 'Arbeidsforhold.AvklarArbeidsforhold',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'Opphold.Lovlig',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: 'Opphold.Bosatt',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'Opphold.Rett',
  [aksjonspunktCodes.AVKLAR_PERSONSTATUS]: 'BehandlingsprosessIndex.CheckAvklarPersonstatus',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR]: 'Overstyr.fodselsvilkar',
  [aksjonspunktCodes.OVERSTYR_FODSELSVILKAR_FAR_MEDMOR]: 'Overstyr.fodselsvilkar',
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'Overstyr.adopsjonsvilkar',
  [aksjonspunktCodes.OVERSTYRING_AV_ADOPSJONSVILKÅRET_FP]: 'Overstyr.adopsjonsvilkar',
  [aksjonspunktCodes.OVERSTYRING_AV_OPPTJENINGSVILKARET]: 'Overstyr.opptjeningsvilkår',
  [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR]: 'Overstyr.medlemskapsvilkar',
  [aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR]: 'Overstyr.soknadsfristvilkar',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'Overstyr.beregning',
  [aksjonspunktCodes.OVERSTYRING_AV_UTTAKPERIODER]: 'Overstyr.uttak',
  [aksjonspunktCodes.MANUELL_AVKLAR_FAKTA_UTTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_ALENEOMSORG]: 'OmsorgFaktaForm.Aleneomsorg.ApplicationInformation',
  [aksjonspunktCodes.MANUELL_KONTROLL_AV_OM_BRUKER_HAR_OMSORG]: 'OmsorgFaktaForm.Omsorg.ApplicationInformation',
  [aksjonspunktCodes.AVKLAR_UTTAK]: 'UttakInfoPanel.FaktaUttak',
  [aksjonspunktCodes.FASTSETT_UTTAKPERIODER]: 'Fastsett.Manuelt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'Beregning.BeregningsgrunnlagManueltATFL',
  [aksjonspunktCodes.VURDER_VARIG_ENDRET_ELLER_NYOPPSTARTET_NAERING_SELVSTENDIG_NAERINGSDRIVENDE]: 'Beregning.VurderVarigEndring',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]: 'Beregning.BeregningsgrunnlagManueltSN',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]: 'Beregning.BeregningsgrunnlagManueltTidsbegrenset',
  [aksjonspunktCodes.AVKLAR_BEREGNINGSGRUNNLAG_OG_INNTEKTSKATEGORI_FOR_BRUKER_MED_TILSTOTENDE_YTELSE]: 'Beregning.BeregningsgrunnlagOgInntektskategoriTY',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]: 'Beregning.BeregningsgrunnlagManueltSNNYIArbeidslivet',
  [aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN]: 'Beregning.VurderFaktaATFLSN',
  [aksjonspunktCodes.FORESLA_VEDTAK]: 'Vedtak.Fritekstbrev',

};

const scrollUp = () => {
  if (window.innerWidth < 1305) {
    window.scroll(0, 0);
  }
  return false;
};


const HistorikkMalType3 = ({
  historikkinnslagDeler, behandlingLocation, intl,
}) => {
  const { formatMessage } = intl;

  const formaterAksjonspunkt = (aksjonspunkt) => {
    const aksjonspktText = aksjonspunktCodesToTextCode[aksjonspunkt.aksjonspunktKode] || aksjonspunkt.aksjonspunktKode;

    if (aksjonspunkt.godkjent) {
      return (
        <Normaltekst>
          {formatMessage({ id: aksjonspktText })}
          {' '}
          {formatMessage({ id: 'Totrinnskontroll.godkjent' })}
        </Normaltekst>
      );
    }
    return (
      <span>
        <Element>
          {formatMessage({ id: aksjonspktText })}
          {' '}
          {formatMessage({ id: 'Totrinnskontroll.ikkeGodkjent' })}
        </Element>
        <Normaltekst>{aksjonspunkt.aksjonspunktBegrunnelse}</Normaltekst>
      </span>
    );
  };

  const mapAksjonspunkt = (aksjonspunkt, index) => (
    <div key={`aksjonspunkt${index + 1}`}>
      {formaterAksjonspunkt(aksjonspunkt)}
      <VerticalSpacer fourPx />
    </div>
  );

  const mapTotrinnsvurdering = (historikkinnslagDel, index) => (
    <div key={`totrinnsvurdering${index + 1}`}>
      {historikkinnslagDel.hendelse
          && (
          <div>
            <Element>{findHendelseText(historikkinnslagDel.hendelse)}</Element>
            <VerticalSpacer fourPx />
          </div>
          )
        }
      {historikkinnslagDel.skjermlenke
        ? (
          <Element>
            <NavLink
              to={createLocationForHistorikkItems(behandlingLocation, historikkinnslagDel.skjermlenke.kode)}
              onClick={scrollUp}
            >
              {historikkinnslagDel.skjermlenke.navn}
            </NavLink>
          </Element>
        )
        : null
        }
      {historikkinnslagDel.aksjonspunkter && historikkinnslagDel.aksjonspunkter.map((aksjonspunkt, i) => mapAksjonspunkt(aksjonspunkt, i))}
    </div>
  );

  return (
    <div>
      {historikkinnslagDeler && historikkinnslagDeler.map((historikkinnslagDel, i) => mapTotrinnsvurdering(historikkinnslagDel, i))}
    </div>
  );
};

HistorikkMalType3.propTypes = {
  historikkinnslagDeler: PropTypes.arrayOf(historikkinnslagDelPropType).isRequired,
  behandlingLocation: PropTypes.shape().isRequired,
  intl: intlShape.isRequired,
};

export default injectIntl(HistorikkMalType3);
