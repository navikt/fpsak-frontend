import { expect } from 'chai';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingOmgjoerCodes from '@fpsak-frontend/kodeverk/src/klageVurderingOmgjoer';
import behandlingStatusCodes from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import klageVurderingCodes from '@fpsak-frontend/kodeverk/src/klageVurdering';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';

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

const medholdIKlage = {
  klageVurdering: klageVurderingCodes.MEDHOLD_I_KLAGE,
  klageVurderingOmgjoer: klageVurderingOmgjoerCodes.GUNST_MEDHOLD_I_KLAGE,
};
const oppheveYtelsesVedtak = { klageVurdering: klageVurderingCodes.OPPHEVE_YTELSESVEDTAK };
const avvistKlage = { klageVurdering: klageVurderingCodes.AVVIS_KLAGE };
const behandlingStatusFVED = { kode: behandlingStatusCodes.FATTER_VEDTAK };
const stadfesteKlage = { klageVurdering: klageVurderingCodes.STADFESTE_YTELSESVEDTAK };


describe('<ApprovalTextUtils2>', () => {
  // Klage
  // Klage medhold
  it('skal vise korrekt tekst for aksjonspunkt 5035 medhold', () => {
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: medholdIKlage,
    };
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.OmgjortTilGunst');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 medhold', () => {
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: medholdIKlage,
    };
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.OmgjortTilGunst');
  });
  // Klage avslag
  // Ytelsesvedtak opphevet
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: oppheveYtelsesVedtak,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.OppheveYtelsesVedtak');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: oppheveYtelsesVedtak,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.OppheveYtelsesVedtak');
  });
  // Klage avvist
  it('skal vise korrekt tekst for aksjonspunkt 5035 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: avvistKlage,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NFP, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.Avvist');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag klage avvist', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: avvistKlage,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.Avvist');
  });
  // Ikke fastsatt Engangsstønad
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ikke fastsatt', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNFP: stadfesteKlage,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.StadfesteYtelsesVedtak');
  });
  it('skal vise korrekt tekst for aksjonspunkt 5036 avslag ytelsesvedtak opphevet', () => {
    const klagebehandlingVurdering = {
      klageVurderingResultatNK: stadfesteKlage,
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.BEHANDLE_KLAGE_NK, undefined,
      undefined, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, klagebehandlingVurdering, behandlingStatusFVED)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Klage.StadfesteYtelsesVedtak');
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
  it('skal vise korrekt tekst for aksjonspunkt 5058 ATFL i samme org', () => {
    const beregningDto = { faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON }] };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.VurderATFLISammeOrg');
  });
  it('skal vise korrekte tekster for kombinasjon av aksjonspunkt 5058', () => {
    const beregningDto = {
      faktaOmBeregningTilfeller: [{ kode: faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING },
        { kode: faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD }],
    };
    const aksjonspunkt = lagAksjonspunkt(
      aksjonspunktCodes.VURDER_FAKTA_FOR_ATFL_SN, undefined,
      beregningDto, 'begrunnelse', false, undefined, 'status', undefined,
    );
    const message = getAksjonspunktText.resultFunc(true, null, null, null, null)(aksjonspunkt);
    expect(message[0].props.id).to.eql('ToTrinnsForm.Beregning.VurderBesteberegning');
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
    const messages = getAksjonspunktText.resultFunc(true, null, null, [])(aksjonspunkt);
    expect(messages[0].props.children[0].props.id).to.eql('ToTrinnsForm.OpplysningerOmSøker.Arbeidsforhold');
    expect(messages[0].props.children[1][0].key).to.eql('ToTrinnsForm.FaktaOmArbeidsforhold.Melding');
  });
});
