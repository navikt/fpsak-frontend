import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import LeggTilArbeidsforholdFelter from './LeggTilArbeidsforholdFelter';

describe('<LeggTilArbeidsforholdFelter>', () => {
  it('Skal sjekke at LeggTilArbeidsforholdFelter rendrer korrekt', () => {
    const wrapper = shallow(
      <LeggTilArbeidsforholdFelter
        readOnly={false}
        formName=""
        behandlingId={1}
        behandlingVersjon={1}
      />,
    );
    expect(wrapper.find('[name=\'navn\']')).has.length(1);
    expect(wrapper.find('[name=\'fomDato\']')).has.length(1);
    expect(wrapper.find('[name=\'tomDato\']')).has.length(1);
    expect(wrapper.find('[name=\'stillingsprosent\']')).has.length(1);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom og tom lik', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: '2019-01-01',
    };
    expect(LeggTilArbeidsforholdFelter.validate(values)).to.eql(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom og tom ikke satt', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: undefined,
    };
    expect(LeggTilArbeidsforholdFelter.validate(values)).to.eql(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom før tom', () => {
    const values = {
      fomDato: '2019-01-01',
      tomDato: '2019-01-02',
    };
    expect(LeggTilArbeidsforholdFelter.validate(values)).to.eql(null);
  });
  it('Skal sjekke at LeggTilArbeidsforholdFelter validerer med fom etter tom', () => {
    const values = {
      fomDato: '2019-01-02',
      tomDato: '2019-01-01',
    };
    const result = LeggTilArbeidsforholdFelter.validate(values);
    expect(result.tomDato[0].id).to.eql('PersonArbeidsforholdDetailForm.DateNotAfterOrEqual');
    expect(result.tomDato[1].dato).to.eql('02.01.2019');
    expect(result.fomDato[0].id).to.eql('PersonArbeidsforholdDetailForm.DateNotBeforeOrEqual');
    expect(result.fomDato[1].dato).to.eql('01.01.2019');
  });
});
