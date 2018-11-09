import { expect } from 'chai';
import FordelingAvBruttoBeregningsgrunnlagPanel, { fordelingAvBruttoBGFieldArrayName } from './FordelingAvBruttoBeregningsgrunnlagPanel';

const createArbeidsforhold = (arbeidsgiverNavn, arbeidsgiverId, startdato, opphoersdato, arbeidsforholdId) => ({
  arbeidsgiverNavn,
  arbeidsgiverId,
  startdato,
  opphoersdato,
  arbeidsforholdId,
});

const createAndel = (andelsnr, arbeidsforhold, fordelingForrigeYtelse, refusjonskrav, fastsattPrAar, inntektskategori, aktivitetStatus, andelIArbeid) => ({
  andelsnr,
  arbeidsforhold,
  fordelingForrigeYtelse,
  refusjonskrav,
  fastsattPrAar,
  inntektskategori,
  aktivitetStatus,
  andelIArbeid,
});


const periode = {
  tilstøtendeYtelseAndeler: [createAndel(
    1, createArbeidsforhold('Sopra Steria AS', '213456789', '1995-01-01', null, '2142324235'),
    100000, 20000, null, { kode: '-' }, { kode: 'AT' }, [0, 50],
  ),
  createAndel(
    2, createArbeidsforhold('Espens byggvarer AS', '1234342342', '2001-01-01', '2003-01-01', '1231414'),
    100000, 20000, null, { kode: '-' }, { kode: 'AT' }, [0, 50],
  ),
  createAndel(
    3, undefined,
    100000, 20000, 10000, { kode: 'SELVSTENDIG_NÆRINGSDRIVENDE' }, { kode: 'BRUKERS_ANDEL', navn: 'Brukers andel' }, [0, 50, 80],
  )],
  dekningsgrad: 100,
  arbeidskategori: 'ARBEIDSTAKER',
  ytelseType: 'SYKEPENGER',
  bruttoBG: 600000,
};

const endretBGPeriode = {
  endringBeregningsgrunnlagAndeler: [{ andelsnr: 2, andelIArbeid: [0] }, { andelsnr: 3, andelIArbeid: [50] }],
  skalKunneEndreRefusjon: true,
};

describe('<FordelingAvBruttoBeregningsgrunnlagPanel>', () => {
  it('skal sette opp initial values for field array', () => {
    const initialValues = FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues(periode, endretBGPeriode);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName]).has.length(3);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andel).to.equal('Sopra Steria AS (213456789) ...4235');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andelsnr).to.equal(1);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsforholdId).to.equal('2142324235');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsperiodeFom).to.equal('1995-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsperiodeTom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].fastsattBeløp).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].inntektskategori).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andelIArbeid).to.equal('0 - 50');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].skalKunneEndreRefusjon).to.equal(true);

    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andel).to.equal('Brukers andel');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andelsnr).to.equal(3);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsforholdId).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsperiodeFom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsperiodeTom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].fastsattBeløp).to.equal('10 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].inntektskategori).to.equal('SELVSTENDIG_NÆRINGSDRIVENDE');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andelIArbeid).to.equal('50.00');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].skalKunneEndreRefusjon).to.equal(true);

    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andel).to.equal('Espens byggvarer AS (1234342342) ...1414');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andelsnr).to.equal(2);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsforholdId).to.equal('1231414');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsperiodeFom).to.equal('2001-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsperiodeTom).to.equal('2003-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].fastsattBeløp).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].inntektskategori).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andelIArbeid).to.equal('0.00');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].skalKunneEndreRefusjon).to.equal(true);
  });


  it('skal sette opp initial values for field array når endret periode er null', () => {
    const initialValues = FordelingAvBruttoBeregningsgrunnlagPanel.buildInitialValues(periode, null);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName]).has.length(3);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andel).to.equal('Sopra Steria AS (213456789) ...4235');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andelsnr).to.equal(1);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsforholdId).to.equal('2142324235');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsperiodeFom).to.equal('1995-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].arbeidsperiodeTom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].fastsattBeløp).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].inntektskategori).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].andelIArbeid).to.equal('0 - 50');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][0].skalKunneEndreRefusjon).to.equal(false);

    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andel).to.equal('Brukers andel');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andelsnr).to.equal(3);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsforholdId).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsperiodeFom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].arbeidsperiodeTom).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].fastsattBeløp).to.equal('10 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].inntektskategori).to.equal('SELVSTENDIG_NÆRINGSDRIVENDE');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].andelIArbeid).to.equal('0 - 80');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][2].skalKunneEndreRefusjon).to.equal(false);

    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andel).to.equal('Espens byggvarer AS (1234342342) ...1414');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andelsnr).to.equal(2);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsforholdId).to.equal('1231414');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsperiodeFom).to.equal('2001-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].arbeidsperiodeTom).to.equal('2003-01-01');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].fordelingForrigeYtelse).to.equal('100 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].fastsattBeløp).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].refusjonskrav).to.equal('20 000');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].inntektskategori).to.equal('');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].andelIArbeid).to.equal('0 - 50');
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].nyAndel).to.equal(false);
    expect(initialValues[fordelingAvBruttoBGFieldArrayName][1].skalKunneEndreRefusjon).to.equal(false);
  });
});
