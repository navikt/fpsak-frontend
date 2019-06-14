import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import sinon from 'sinon';
import faktaOmBeregningTilfelle from '@fpsak-frontend/kodeverk/src/faktaOmBeregningTilfelle';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import aktivitetStatus from '@fpsak-frontend/kodeverk/src/aktivitetStatus';
import {
  FaktaForATFLOgSNPanelImpl,
  getHelpTextsFaktaForATFLOgSN,
  transformValuesFaktaForATFLOgSN,
  transformValues,
} from './FaktaForATFLOgSNPanel';
import TidsbegrensetArbeidsforholdForm from './tidsbegrensetArbeidsforhold/TidsbegrensetArbeidsforholdForm';
import NyIArbeidslivetSNForm from './nyIArbeidslivet/NyIArbeidslivetSNForm';
import { lonnsendringField } from './vurderOgFastsettATFL/forms/LonnsendringForm';
import { erNyoppstartetFLField } from './vurderOgFastsettATFL/forms/NyoppstartetFLForm';
import {
  besteberegningField,
} from './besteberegningFodendeKvinne/VurderBesteberegningForm';
import VurderOgFastsettATFL, { INNTEKT_FIELD_ARRAY_NAME } from './vurderOgFastsettATFL/VurderOgFastsettATFL';

const {
  VURDER_FAKTA_FOR_ATFL_SN,
} = aksjonspunktCodes;

const aksjonspunkter = [{
  definisjon:
  { kode: VURDER_FAKTA_FOR_ATFL_SN },
}];


const showTableCallback = sinon.spy();

const lagBeregningsgrunnlag = andeler => ({
  beregningsgrunnlagPeriode: [
    {
      beregningsgrunnlagPrStatusOgAndel: andeler.map(andel => (
        {
          andelsnr: andel.andelsnr,
          aktivitetStatus: { kode: andel.aktivitetStatus },
          inntektskategori: { kode: andel.inntektskategori },
          erNyoppstartet: andel.erNyoppstartet,
        }
      )),
    },
  ],
});


describe('<FaktaForATFLOgSNPanel>', () => {
  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD, faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET,
      faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL, faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
    expect(helpText[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning');
  });

  it('skal lage helptext for fastsetting av ATFL inntekt sammen men refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON,
      faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
  });

  it('skal lage helptext for fastsetting av ATFL inntekt uten refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_AT_OG_FL_I_SAMME_ORGANISASJON];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(1);
  });

  it('skal ikkje lage helptext for kun refusjon og gradering', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsFaktaForATFLOgSN.resultFunc(aktivertePaneler, aksjonspunkter, [], []);
    expect(helpText).to.have.length(0);
  });

  it('skal vise TidsbegrensetArbeidsforholdForm', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    const wrapper = shallow(<FaktaForATFLOgSNPanelImpl
      readOnly={false}
      aktivePaneler={aktivertePaneler}
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
      isAksjonspunktClosed={false}
      showTableCallback={showTableCallback}
    />);
    const vurderATFL = wrapper.find(VurderOgFastsettATFL);
    expect(vurderATFL).to.have.length(1);
  });

  it('skal kunne transform values for kun besteberegning', () => {
    const aktivePaneler = [faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE];
    const andel1 = { andelsnr: 1, aktivitetStatus: { kode: 'ATFL' } };
    const andel2 = { andelsnr: 2, aktivitetStatus: { kode: 'SN' } };
    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: aktivePaneler.map(kode => ({ kode })),
      besteberegningAndeler: [andel1, andel2],
      vurderBesteberegning: { andeler: [andel1, andel2] },
    };
    const beregningsgrunnlag = {
      beregninsgrunnlagPeriode: [
        {
          beregningsgrunnlagPrStatusOgAndel: [andel1, andel2],
        },
      ],
    };
    const values = {
      tilfeller: aktivePaneler,
      endringBGPerioder: [],
      vurderMottarYtelse: undefined,
      faktaOmBeregning,
      beregningsgrunnlag,
    };
    values[besteberegningField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      {
        fastsattBelop: '10 000', inntektskategori: 'ARBEIDSTAKER', andelsnr: andel1.andelsnr, skalRedigereInntekt: true,
      },
      {
        fastsattBelop: '20 000', inntektskategori: 'SELVSTENDIG_NÆRINGSDRIVENDE', andelsnr: andel2.andelsnr, skalRedigereInntekt: true,
      },
    ];
    const transformedValues = transformValuesFaktaForATFLOgSN(values);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller).to.have.length(2);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller[1]).is.eql(faktaOmBeregningTilfelle.FASTSETT_BESTEBEREGNING_FODENDE_KVINNE);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller[0]).is.eql(faktaOmBeregningTilfelle.VURDER_BESTEBEREGNING);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe).to.have.length(2);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].andelsnr).is.eql(andel1.andelsnr);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.fastsattBeløp).is.eql(10000);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[0].fastsatteVerdier.inntektskategori).is.eql('ARBEIDSTAKER');
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].andelsnr).is.eql(andel2.andelsnr);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.fastsattBeløp).is.eql(20000);
    expect(transformedValues.fakta.besteberegningAndeler.besteberegningAndelListe[1].fastsatteVerdier.inntektskategori).is.eql('SELVSTENDIG_NÆRINGSDRIVENDE');
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
        kode: 'ARBEIDSTAKER',
        navn: 'Arbeidstaker',
      },
      arbeidsforhold: {
        arbeidsgiverNavn: 'bedrift',
        arbeidsgiverId: '123',
        arbeidsforholdId: 'abc',
        startdato: '2018-01-01',
      },
    };


    const frilansAndel = {
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
      aktivitetStatus: { kode: aktivitetStatus.FRILANSER },
    };

    const faktaOmBeregning = {
      faktaOmBeregningTilfeller: aktivePaneler.map(kode => ({ kode })),
      arbeidsforholdMedLønnsendringUtenIM: [forholdMedLonnsendringUtenIM],
      arbeidstakerOgFrilanserISammeOrganisasjonListe: [forholdMedAtOgFl],
      frilansAndel,
    };
    const beregningsgrunnlag = lagBeregningsgrunnlag([forholdMedLonnsendringUtenIM, frilansAndel]);
    const values = {
      tilfeller: aktivePaneler,
      endringBGPerioder: [],
      vurderMottarYtelse: undefined,
      faktaOmBeregning,
      beregningsgrunnlag,
    };
    values[lonnsendringField] = true;
    values[erNyoppstartetFLField] = true;
    values[INNTEKT_FIELD_ARRAY_NAME] = [
      {
        fastsattBelop: '10 000', inntektskategori: 'ARBEIDSTAKER', andelsnr: forholdMedLonnsendringUtenIM.andelsnr, skalRedigereInntekt: true,
      },
      {
        fastsattBelop: '20 000',
        inntektskategori: 'FRILANS',
        andelsnr: frilansAndel.andelsnr,
        aktivitetStatus: aktivitetStatus.FRILANSER,
        skalRedigereInntekt: true,
      },
    ];
    const transformedValues = transformValuesFaktaForATFLOgSN(values);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller).to.have.length(4);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_LONNSENDRING)).is.eql(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller
      .includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSLONN_ARBEIDSTAKER_UTEN_INNTEKTSMELDING)).is.eql(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.VURDER_NYOPPSTARTET_FL)).is.eql(true);
    expect(transformedValues.fakta.faktaOmBeregningTilfeller.includes(faktaOmBeregningTilfelle.FASTSETT_MAANEDSINNTEKT_FL)).is.eql(true);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe).to.have.length(1);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].andelsnr).to.eql(2);
    expect(transformedValues.fakta.fastsattUtenInntektsmelding.andelListe[0].fastsatteVerdier.fastsattBeløp).to.eql(10000);
    expect(transformedValues.fakta.fastsettMaanedsinntektFL.maanedsinntekt).to.eql(20000);
  });

  it('skal transform values for nyIArbeidslivet om kun ny i arbeidslivet', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 0);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });

  it('skal transform values for nyIArbeidslivet og kortvarig om kun ny i arbeidslivet og kortvarig', () => {
    const nyIArbTransform = sinon.spy();
    const kortvarigTransform = sinon.spy();
    const nyoppstartetTransform = sinon.spy();
    const lonnsendringTransform = sinon.spy();
    const etterlonnTransform = sinon.spy();
    const mottarYtelseTransform = sinon.spy();

    const aktivePaneler = [faktaOmBeregningTilfelle.VURDER_SN_NY_I_ARBEIDSLIVET, faktaOmBeregningTilfelle.VURDER_TIDSBEGRENSET_ARBEIDSFORHOLD];
    transformValues(aktivePaneler,
      nyIArbTransform,
      kortvarigTransform,
      nyoppstartetTransform,
      lonnsendringTransform,
      etterlonnTransform,
      mottarYtelseTransform)({}, {});
    expect(nyIArbTransform).to.have.property('callCount', 1);
    expect(kortvarigTransform).to.have.property('callCount', 1);
    expect(nyoppstartetTransform).to.have.property('callCount', 0);
    expect(lonnsendringTransform).to.have.property('callCount', 0);
    expect(etterlonnTransform).to.have.property('callCount', 0);
    expect(mottarYtelseTransform).to.have.property('callCount', 0);
  });
});
