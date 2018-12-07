import { expect } from 'chai';
import faktaOmBeregningTilfelle from 'kodeverk/faktaOmBeregningTilfelle';
import { createEndretArbeidsforholdString, getHelpTextsEndringBG } from './EndretBeregningsgrunnlagUtils';

const forhold = [
  {
    arbeidsgiverNavn: 'arbeidsgiver 1',
    arbeidsgiverId: '123456789',
    startdato: '2017-01-01',
    opphoersdato: '2017-02-02',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-15',
        erGradering: true,
        erRefusjon: false,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 3',
    arbeidsgiverId: '123456789',
    startdato: '2017-01-01',
    opphoersdato: '2017-02-02',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-15',
        tom: '2017-06-15',
        erGradering: true,
        erRefusjon: false,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 2',
    arbeidsgiverId: '987654321',
    startdato: '2017-02-02',
    opphoersdato: '2017-03-03',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-20',
        erGradering: false,
        erRefusjon: true,
      },
    ],
  },
  {
    arbeidsgiverNavn: 'arbeidsgiver 4',
    arbeidsgiverId: '987654321',
    startdato: '2017-02-02',
    opphoersdato: '2017-03-03',
    perioderMedGraderingEllerRefusjon: [
      {
        fom: '2017-01-20',
        tom: '2017-06-15',
        erGradering: false,
        erRefusjon: true,
      },
    ],
  },
];

describe('<EndretBeregningsgrunnlagUtils>', () => {
  it('skal lage endret arbeidsforhold string', () => {
    const endretAFGraderingString = createEndretArbeidsforholdString(forhold
      .filter(af => af.perioderMedGraderingEllerRefusjon.map(({ erGradering }) => erGradering).includes(true)), true);
    expect(endretAFGraderingString).to.equal('arbeidsgiver 1 (123456789) f.o.m. 15.01.2017 og'
      + ' arbeidsgiver 3 (123456789) f.o.m. 15.01.2017 - t.o.m. 15.06.2017');


    const endretAFRefusjonString = createEndretArbeidsforholdString(forhold
      .filter(af => af.perioderMedGraderingEllerRefusjon.map(({ erRefusjon }) => erRefusjon).includes(true)), false);
    expect(endretAFRefusjonString).to.equal('arbeidsgiver 2 (987654321) f.o.m. 20.01.2017 og'
      + ' arbeidsgiver 4 (987654321) f.o.m. 20.01.2017 - t.o.m. 15.06.2017');
  });

  const ap = {
    definisjon: {
      kode: '5058',
    },
  };

  it('skal lage helptext', () => {
    const aktivertePaneler = [faktaOmBeregningTilfelle.FASTSETT_ENDRET_BEREGNINGSGRUNNLAG];
    const helpText = getHelpTextsEndringBG.resultFunc(aktivertePaneler, forhold, [ap]);
    expect(helpText[0].props.children).to.have.length(3);
    expect(helpText[0].props.children[0].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Gradering');
    expect(helpText[0].props.children[0].props.values.arbeidsforhold)
      .to.equal('arbeidsgiver 1 (123456789) f.o.m. 15.01.2017 og arbeidsgiver 3 (123456789) f.o.m. 15.01.2017 - t.o.m. 15.06.2017');
    expect(helpText[0].props.children[2].props.id).to.equal('BeregningInfoPanel.AksjonspunktHelpText.FaktaOmBeregning.EndringBeregningsgrunnlag.Refusjon');
    expect(helpText[0].props.children[2].props.values.arbeidsforhold)
      .to.equal('arbeidsgiver 2 (987654321) f.o.m. 20.01.2017 og arbeidsgiver 4 (987654321) f.o.m. 20.01.2017 - t.o.m. 15.06.2017');
  });
});
