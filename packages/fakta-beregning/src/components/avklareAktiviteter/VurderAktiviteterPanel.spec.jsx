import { expect } from 'chai';
import { isRequiredMessage } from '@fpsak-frontend/utils';
import VurderAktiviteterPanel from './VurderAktiviteterPanel';
import {
  BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME,
} from './AvklareAktiviteterPanel';

const aktivitet1 = {
  arbeidsgiverNavn: 'Arbeidsgiveren',
  arbeidsgiverId: '384723894723',
  fom: '2019-01-01',
  tom: null,
  skalBrukes: null,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};

const aktivitet2 = {
  arbeidsgiverNavn: 'Arbeidsgiveren2',
  arbeidsgiverId: '334534623342',
  arbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: true,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};

const aktivitet3 = {
  arbeidsgiverNavn: 'Arbeidsgiveren3',
  aktørIdString: '324234234234',
  arbeidsgiverId: '1960-01-01',
  arbeidsforholdId: 'efj8343f34f',
  fom: '2019-01-01',
  tom: '2019-02-02',
  skalBrukes: false,
  arbeidsforholdType: { kode: 'ARBEID', navn: 'Arbeid', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
};


const aktivitetAAP = {
  arbeidsgiverNavn: null,
  arbeidsgiverId: null,
  arbeidsforholdType: { kode: 'AAP', navn: 'Arbeidsavklaringspenger', kodeverk: 'OPPTJENING_AKTIVITET_TYPE' },
  fom: '2019-01-01',
  tom: '2020-02-02',
  skalBrukes: null,
};

const aktiviteter = [
  aktivitet1,
  aktivitet2,
  aktivitet3,
  aktivitetAAP,
];

const id1 = '3847238947232019-01-01';
const id2 = '334534623342efj8343f34f2019-01-01';
const id3 = '1960-01-01efj8343f34f2019-01-01';
const idAAP = 'AAP2019-01-01';

describe('<VurderAktiviteterPanel>', () => {
  it('skal validere om ingen aktiviteter skal brukes og det ikkje finnes fleire aktiviteter i opptjeningsperioden', () => {
    const aktiviteterTomDatoMapping = [
      { tom: '2019-02-02', aktiviteter },
    ];
    const values = {};
    values[id1] = { skalBrukes: false };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: false };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const errors = VurderAktiviteterPanel.validate(values, aktiviteterTomDatoMapping);
    // eslint-disable-next-line no-underscore-dangle
    expect(errors._error).to.equal('VurderAktiviteterTabell.Validation.MåHaMinstEnAktivitet');
  });

  it('skal ikkje validere om ingen aktiviteter skal brukes og det finnes fleire aktiviteter i opptjeningsperioden', () => {
    const aktiviteterTomDatoMapping = [
      { tom: '2019-02-02', aktiviteter: [aktivitet3, aktivitetAAP] },
      { tom: '2019-01-02', aktiviteter: [aktivitet1, aktivitet2] },

    ];
    const values = {};
    values[id1] = { skalBrukes: true };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: false };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const errors = VurderAktiviteterPanel.validate(values, aktiviteterTomDatoMapping);
    expect(errors).to.be.empty;
  });


  it('skal validere om ingen aktiviteter er valgt i stp nr 2', () => {
    const aktiviteterTomDatoMapping = [
      { tom: '2019-02-02', aktiviteter: [aktivitet3, aktivitetAAP] },
      { tom: '2019-01-02', aktiviteter: [aktivitet1] },
      { tom: '2019-01-01', aktiviteter: [aktivitet2] },

    ];
    const values = {};
    values[id1] = { skalBrukes: false };
    values[id2] = { skalBrukes: null };
    values[id3] = { skalBrukes: false };
    values[idAAP] = { skalBrukes: false };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const errors = VurderAktiviteterPanel.validate(values, aktiviteterTomDatoMapping);
    // eslint-disable-next-line no-underscore-dangle
    expect(errors._error).to.equal('VurderAktiviteterTabell.Validation.MåHaMinstEnAktivitet');
  });

  it('skal validere ubesvart radio', () => {
    const aktiviteterTomDatoMapping = [
      { tom: '2019-02-02', aktiviteter },
      { tom: '2019-02-02', aktiviteter: [aktivitet1, aktivitet2] },

    ];
    const values = {};
    values[id1] = { skalBrukes: false };
    values[id2] = { skalBrukes: false };
    values[id3] = { skalBrukes: null };
    values[idAAP] = { skalBrukes: false };
    values[BEGRUNNELSE_AVKLARE_AKTIVITETER_NAME] = 'sefiojsiejfise';
    const errors = VurderAktiviteterPanel.validate(values, aktiviteterTomDatoMapping);
    expect(errors[id3].skalBrukes[0].id).to.equal(isRequiredMessage()[0].id);
  });
});
