import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  FaktaForATFLOgSNPanelImpl,
  getHelpTextsFaktaForATFLOgSN,
  transformValuesFaktaForATFLOgSN,
} from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import FastsettEndretBeregningsgrunnlag from './endringBeregningsgrunnlag/FastsettEndretBeregningsgrunnlag';
import TilstotendeYtelseIKombinasjon from './tilstøtendeYtelse/TilstotendeYtelseIKombinasjon';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import { createInputfieldKeyAT, createInputfieldKeyFL } from './vurderOgFastsettATFL/forms/FastsettATFLInntektForm';
import { lonnsendringField } from './vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  createInputFieldKeyForAndel,
  createSelectfieldKeyForAndel,
} from './besteberegningFodendeKvinne/FastsettBBFodendeKvinneForm';
import VurderOgFastsettATFL from './vurderOgFastsettATFL/VurderOgFastsettATFL';


const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const aksjonspunkter = [{
  definisjon:
  { kode: VURDER_FAKTA_FOR_ATFL_SN },
}];

const showTableCallback = sinon.spy();


describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
    expect(helpText[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning');
  });


  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const tidsbegrensetArbeidsforhold = wrapper.find(TidsbegrensetArbeidsforholdForm);
    expect(tidsbegrensetArbeidsforhold).to.have.length(1);
  });

  it('skal vise NyIArbeidslivetSNForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const nyIArbeidslivet = wrapper.find(NyIArbeidslivetSNForm);
    expect(nyIArbeidslivet).to.have.length(1);
  });

  it('skal vise NyoppstartetFLForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const vurderATFL = wrapper.find(VurderOgFastsettATFL);
    expect(vurderATFL).to.have.length(1);
  });

  it('skal vise FastsettEndretBeregningsgrunnlag', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const endretBeregninsgrunnlag = wrapper.find(FastsettEndretBeregningsgrunnlag);
    expect(endretBeregninsgrunnlag).to.have.length(1);
  });

  it('skal rendre Inntektstabell om Tilstøtende ytelse og kortvarig arbeidsforhold', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
      formName="test"
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const tyKombinasjon = wrapper.find(TilstotendeYtelseIKombinasjon);
    expect(tyKombinasjon).to.have.length(1);
  });

  it('legge kun legge til values fra TY om TY og ATFL i samme org i kombinasjon', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const faktaOmBeregning = {
      tilstøtendeYtelse: {
        skalReduseres: false,
        dekningsgrad: 100,
        erBesteberegning: false,
      },
      arbeidsforholdMedLønnsendringUtenIM: [{ andelsnr: 1 }, { andelsnr: 2 }],
    };
    const values = {
      bruttoBGFordeling: [
        {
          andel: 'test',
          andelsnr: 1,
          nyAndel: false,
          arbeidsforholdId: '324234232',
          fastsattBeløp: '10 000',
          inntektskategori: 'ARBEIDSTAKER',
          lagtTilAvSaksbehandler: false,

        },
      ],
    };
    const transformValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, aksjonspunkter, faktaOmBeregning)(values);
    expect(transformValues[0].faktaOmBeregningTilfeller).to.have.length(1);
    expect(transformValues[0].faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.TILSTOTENDE_YTELSE);
  });


  it('legge kun legge til values fra ATFL i samme org i kombinasjon om sammen med besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE, faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const arbeidsforhold1 = { arbeidsgiverNavn: 'navn', startdato: 'dato', arbeidsforholdId: '1' };
    const arbeidsforhold2 = { arbeidsgiverNavn: 'navn', startdato: 'dato', arbeidsforholdId: '2' };
    const faktaOmBeregning = {
      tilstøtendeYtelse: {
        skalReduseres: false,
        dekningsgrad: 100,
        erBesteberegning: false,
      },
      frilansAndel: { andelsnr: 3 },
      arbeidsforholdMedLønnsendringUtenIM: [
        { andelsnr: 1, inntektPrMnd: 10000, arbeidsforhold: arbeidsforhold1 },
        { andelsnr: 2, inntektPrMnd: 10000, arbeidsforhold: arbeidsforhold2 }],
    };
    const values = {};
    values[createInputfieldKeyAT(arbeidsforhold1)] = '10 000';
    values[createInputfieldKeyAT(arbeidsforhold2)] = '10 000';
    values[createInputfieldKeyFL()] = '20 000';
    const transformValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, aksjonspunkter, faktaOmBeregning)(values);
    expect(transformValues[0].faktaOmBeregningTilfeller).to.have.length(1);
    expect(transformValues[0].faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON);
  });

  it('skal kunne transform values for kun besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const andel1 = { andelsnr: 1, aktivitetStatus: { kode: 'ATFL' } };
    const andel2 = { andelsnr: 2, aktivitetStatus: { kode: 'SN' } };
    const faktaOmBeregning = {
      besteberegningAndeler: [andel1, andel2],
    };
    const values = {};
    values[createInputFieldKeyForAndel(andel1)] = '10 000';
    values[createSelectfieldKeyForAndel(andel1)] = 'ARBEIDSTAKER';
    values[createInputFieldKeyForAndel(andel2)] = '20 000';
    values[createSelectfieldKeyForAndel(andel2)] = 'SELVSTENDIG_NÆRINGSDRIVENDE';
    const transformValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, aksjonspunkter, faktaOmBeregning)(values);
    expect(transformValues[0].faktaOmBeregningTilfeller).to.have.length(1);
    expect(transformValues[0].faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe).to.have.length(2);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[0].andelsnr).is.eql(andel1.andelsnr);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[0].inntektPrMnd).is.eql(10000);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[0].inntektskategori).is.eql('ARBEIDSTAKER');
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[1].andelsnr).is.eql(andel2.andelsnr);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[1].inntektPrMnd).is.eql(20000);
    expect(transformValues[0].besteberegningAndeler.besteberegningAndelListe[1].inntektskategori).is.eql('SELVSTENDIG_NÆRINGSDRIVENDE');
  });


  it('skal kunne transform values nyoppstartet fl og lønnsendring', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.VURDER_LONNSENDRING];
    const forholdMedAtOgFl = {
      andelsnr: 2,
      inntektskategori: {
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const forholdMedLonnsendringUtenIM = {
      andelsnr: 2,
      inntektskategori: {
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };

    const faktaOmBeregning = {
      arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
      frilansAndel: {
        inntektskategori: {
          navn: 'Frilans',
        },
        arbeidsforhold: {
          startdato: '2018-01-01',
          opphoersdato: '2018-06-01',
        },
        andelsnr: 1,
        arbeidsforholdType: {
          navn: 'Frilans',
        },
      },
    };
    const values = {};
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[createInputfieldKeyAT(forholdMedLonnsendringUtenIM.arbeidsforhold)] = '10 000';
    values[createInputfieldKeyFL()] = '20 000';
    const transformValues = transformValuesFaktaForATFLOgSN.resultFunc(aktivePaneler, [], undefined, aksjonspunkter, faktaOmBeregning)(values);
    expect(transformValues[0].faktaOmBeregningTilfeller).to.have.length(4);
    expect(transformValues[0].faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)).is.eql(true);
    expect(transformValues[0].faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_VED_LONNSENDRING)).is.eql(true);
    expect(transformValues[0].faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)).is.eql(true);
    expect(transformValues[0].faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)).is.eql(true);
    expect(transformValues[0].fastsatteLonnsendringer.vurderLønnsendringAndelListe).to.have.length(1);
    expect(transformValues[0].fastsatteLonnsendringer.vurderLønnsendringAndelListe[0].andelsnr).to.eql(2);
    expect(transformValues[0].fastsatteLonnsendringer.vurderLønnsendringAndelListe[0].arbeidsinntekt).to.eql(10000);
    expect(transformValues[0].fastsettMaanedsinntektFL.maanedsinntekt).to.eql(20000);
  });
});
