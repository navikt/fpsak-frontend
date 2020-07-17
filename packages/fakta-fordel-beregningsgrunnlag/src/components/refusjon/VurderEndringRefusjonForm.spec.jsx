import { expect } from 'chai';
import { transformValues } from './VurderEndringRefusjonForm';
import { lagNøkkel } from './VurderEndringRefusjonRad';

const BEGRUNNELSE_FIELD = 'VURDER_REFUSJON_BERGRUNN_BEGRUNNELSE';

const lagAndel = (agNavn, agOrgnr, arbId, dato) => ({
  aktivitetStatus: {
    kode: 'AT',
  },
  nyttRefusjonskravFra: dato,
  arbeidsgiverId: {
    arbeidsgiverOrgnr: agOrgnr,
  },
  arbeidsgiverNavn: agNavn,
  internArbeidsforholdRef: arbId,
  tidligereUtbetalinger: [],
});

const lagBG = (andeler) => ({
  refusjonTilVurdering: {
    andeler,
  },
});

describe('<VurderEndringRefusjonForm>', () => {
  it('Skal utføre transformeValues korrekt med et ref.krav hos en AG', () => {
    const andel = lagAndel('Biri bakeri og saueoppdrett', '999999999', undefined, '01.09.2018');
    const values = {};
    values[lagNøkkel(andel)] = '01.10.2018';
    values[BEGRUNNELSE_FIELD] = 'En begrunnelse';
    const transformed = transformValues(values, lagBG([andel]));
    const expected = {
      kode: '5059',
      begrunnelse: 'En begrunnelse',
      fastsatteAndeler: [
        {
          arbeidsgiverOrgnr: '999999999',
          arbeidsgiverAktoerId: undefined,
          internArbeidsforholdRef: undefined,
          fastsattRefusjonFra: '01.10.2018',
        },
      ],
    };
    expect(transformed).to.deep.equal(expected);
  });

  it('Skal utføre transformeValues korrekt med to ref.krav hos en AG', () => {
    const andel1 = lagAndel('Biri bakeri og saueoppdrett', '999999999', 'REF-1', '01.09.2018');
    const andel2 = lagAndel('Biri bakeri og saueoppdrett', '999999999', 'REF-2', '01.10.2018');
    const values = {};
    values[lagNøkkel(andel1)] = '01.10.2018';
    values[lagNøkkel(andel2)] = '01.11.2018';
    values[BEGRUNNELSE_FIELD] = 'En begrunnelse';
    const transformed = transformValues(values, lagBG([andel1, andel2]));
    const expected = {
      kode: '5059',
      begrunnelse: 'En begrunnelse',
      fastsatteAndeler: [
        {
          arbeidsgiverOrgnr: '999999999',
          arbeidsgiverAktoerId: undefined,
          internArbeidsforholdRef: 'REF-1',
          fastsattRefusjonFra: '01.10.2018',
        },
        {
          arbeidsgiverOrgnr: '999999999',
          arbeidsgiverAktoerId: undefined,
          internArbeidsforholdRef: 'REF-2',
          fastsattRefusjonFra: '01.11.2018',
        },
      ],
    };
    expect(transformed).to.deep.equal(expected);
  });
  it('Skal utføre transformeValues korrekt med to ref.krav hos forskjellig AG', () => {
    const andel1 = lagAndel('Biri bakeri og saueoppdrett', '999999999', 'REF-1', '01.09.2018');
    const andel2 = lagAndel('Biri bakeri og griseoppdrett', '999999998', 'REF-1', '01.10.2018');
    const values = {};
    values[lagNøkkel(andel1)] = '01.10.2018';
    values[lagNøkkel(andel2)] = '01.11.2018';
    values[BEGRUNNELSE_FIELD] = 'En begrunnelse';
    const transformed = transformValues(values, lagBG([andel1, andel2]));
    const expected = {
      kode: '5059',
      begrunnelse: 'En begrunnelse',
      fastsatteAndeler: [
        {
          arbeidsgiverOrgnr: '999999999',
          arbeidsgiverAktoerId: undefined,
          internArbeidsforholdRef: 'REF-1',
          fastsattRefusjonFra: '01.10.2018',
        },
        {
          arbeidsgiverOrgnr: '999999998',
          arbeidsgiverAktoerId: undefined,
          internArbeidsforholdRef: 'REF-1',
          fastsattRefusjonFra: '01.11.2018',
        },
      ],
    };
    expect(transformed).to.deep.equal(expected);
  });
});
