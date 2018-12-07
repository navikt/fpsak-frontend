import { expect } from 'chai';

import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';

describe('<RegistrereVergeFaktaForm>', () => {
  it('skal sette opp initielle verdier fra behandling', () => {
    const verge = {
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      mandatTekst: 'tekst',
      fnr: '1234',
      sokerErKontaktPerson: true,
      vergeErKontaktPerson: false,
      sokerErUnderTvungenForvaltning: false,
      vergeType: { kode: 'VergeType' },
    };

    const initialValues = RegistrereVergeFaktaForm.buildInitialValues(verge);

    expect(initialValues).to.eql({
      navn: 'Tester',
      gyldigFom: '2017',
      gyldigTom: '2018',
      mandatTekst: 'tekst',
      fnr: '1234',
      sokerErKontaktPerson: true,
      vergeErKontaktPerson: false,
      sokerErUnderTvungenForvaltning: false,
      vergeType: 'VergeType',
    });
  });
});
