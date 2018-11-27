import { expect } from 'chai';
import aksjonspunktCodes from 'kodeverk/aksjonspunktCodes';
import klageVurdering from 'kodeverk/klageVurdering';
import behandlingResultatType from 'kodeverk/behandlingResultatType';
import fagsakYtelseType from 'kodeverk/fagsakYtelseType';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import getAksjonspunktText from './ApprovalTextUtils';


const lagAksjonspunkt = (
  aksjonspunktKode, opptjeningAktiviteter, beregningDto,
  besluttersBegrunnelse, totrinnskontrollGodkjent,
  vurderPaNyttArsaker, status, uttakPerioder, arbeidforholdDtos,
) => ({
  aksjonspunktKode,
  opptjeningAktiviteter,
  beregningDto,
  besluttersBegrunnelse,
  totrinnskontrollGodkjent,
  vurderPaNyttArsaker,
  status,
  uttakPerioder,
  arbeidforholdDtos,
});

const medholdIKlage = { klageVurdering: klageVurdering.MEDHOLD_I_KLAGE };
const oppheveYtelsesVedtak = { klageVurdering: klageVurdering.OPPHEVE_YTELSESVEDTAK };
const avvistKlage = { klageVurdering: klageVurdering.KLAGE_AVVIST };


describe('<ApprovalTextUtils>', () => {
  // Klage
  // Klage medhold
  it('skal vise korrekt tekst for aksjonspunkt 5035 medhold', () => {
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, medholdIKlage, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageMedhold');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 medhold', () => {
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, medholdIKlage, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageMedhold');
  });
  // Klage avslag
  // Ytelsesvedtak opphevet
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag ytelsesvedtak opphevet', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET } };
    const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, oppheveYtelsesVedtak, null, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageYtelsesvedtakOpphevet');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.KLAGE_YTELSESVEDTAK_OPPHEVET } };
    const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, oppheveYtelsesVedtak, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageYtelsesvedtakOpphevet');
  });
  // Klage avvist
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag klage avvist', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.KLAGE_AVVIST } };
    const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, avvistKlage, null, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageAvvist');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag klage avvist', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.KLAGE_AVVIST } };
    const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, avvistKlage, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ResultatKlageAvvist');
  });
  // Ikke fastsatt Engangsstønad
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ikke fastsatt', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.IKKE_FASTSATT } };
    const ytelseType = fagsakYtelseType.ENGANGSSTONAD;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, avvistKlage, null, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.EngangsstonadIkkeInnvilget');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const behandlingsresultat = { type: { kode: behandlingResultatType.IKKE_FASTSATT } };
    const ytelseType = fagsakYtelseType.FORELDREPENGER;

    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, avvistKlage, ytelseType, behandlingsresultat)(aksjonspunkt);
    expect(message[0].props.id).to.eql('VedtakForm.ForeldrepengerIkkeInnvilget');
  });

  it('skal vise korrekt tekst for aksjonspunkt 5058 vurder tidsbegrenset', () => {
    const beregningDto = { faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD }] };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.VurderTidsbegrensetArbeidsforhold');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5058 fastsett endret beregningsgrunnlag', () => {
    const beregningDto = { faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG }] };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.FastsettEndretBeregningsgrunnlag');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5058 ATFL i samme org', () => {
    const beregningDto = { faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON }] };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.VurderATFLISammeOrg');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5058 tilstøtende ytelse', () => {
    const beregningDto = { faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE }] };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.BeregningsgrunnlagOgInntektskategoriFastsatt');
  });
  it('skal vise korrekte tekster for kombinasjon av aksjonspunkt 5058', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE },
        { kode: faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD }],
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.BeregningsgrunnlagOgInntektskategoriFastsatt');
    expect(message[1].props.id).to.eql('ToTrinnsForm.Beregning.VurderTidsbegrensetArbeidsforhold');
  });


  it('skal vise korrekt tekst for aksjonspunkt 5080', () => {
    const arbeidforholdDtos = [{
      navn: 'COLOR LINE CREW AS',
      organisasjonsnummer: '973135678',
      arbeidsforholdId: 'e3602f7b-bf36-40d4-8e3a-22333daf664b',
      arbeidsforholdHandlingType: {
        kode: 'BRUK_UTEN_INNTEKTSMELDING',
        navn: 'Bruk, men ikke benytt inntektsmelding',
        kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE',
      },
    }, {
      navn: 'SESAM AS',
      organisasjonsnummer: '976037286',
      arbeidsforholdId: null,
      arbeidsforholdHandlingType: {
        kode: 'IKKE_BRUK',
        navn: 'Ikke bruk',
        kodeverk: 'ARBEIDSFORHOLD_HANDLING_TYPE',
      },
    }];
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.AVKLAR_ARBEIDSFORHOLD, undefined,
      undefined, undefined, false, undefined, 'status', undefined, arbeidforholdDtos,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.OpplysningerOmSøker.Arbeidsforhold');
  });
});
