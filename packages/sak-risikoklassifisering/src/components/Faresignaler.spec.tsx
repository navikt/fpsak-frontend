import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { Normaltekst } from 'nav-frontend-typografi';
import Faresignaler from './Faresignaler';

const mockRisikoklassifisering = (medlSignaler, iaySignaler) => ({
  kontrollresultat: {
    kode: 'HOY',
    kodeverk: 'Kontrollresultat',
  },
  medlFaresignaler: {
    faresignaler: medlSignaler,
  },
  iayFaresignaler: {
    faresignaler: iaySignaler,
  },
});

describe('<Faresignaler>', () => {
  it('skal teste at komponent mountes korrekt når vi har faresignaler i medl kategorien', () => {
    const wrapper = shallow(<Faresignaler
      risikoklassifisering={mockRisikoklassifisering(['Dette er en grunn', 'Dette er en annen grunn'], undefined)}
    />);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.prop('id')).is.eql('Risikopanel.Panel.Medlemskap');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(2);
    expect(normaltekst.children().at(0).text()).is.eql('Dette er en grunn');
    expect(normaltekst.children().at(1).text()).is.eql('Dette er en annen grunn');
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i iay kategorien', () => {
    const wrapper = shallow(<Faresignaler
      risikoklassifisering={mockRisikoklassifisering(undefined, ['Dette er en grunn', 'Dette er en annen grunn'])}
    />);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(1);
    expect(formattedMessage.prop('id')).is.eql('Risikopanel.Panel.ArbeidsforholdInntekt');

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(2);
    expect(normaltekst.children().at(0).text()).is.eql('Dette er en grunn');
    expect(normaltekst.children().at(1).text()).is.eql('Dette er en annen grunn');
  });

  it('skal teste at komponent mountes korrekt når vi har faresignaler i begge kategorier', () => {
    const wrapper = shallow(<Faresignaler
      risikoklassifisering={mockRisikoklassifisering(['Grunn 1', 'Grunn 2'], ['Grunn 3', 'Grunn 4'])}
    />);
    const formattedMessage = wrapper.find('FormattedMessage');
    expect(formattedMessage).to.have.length(2);

    const normaltekst = wrapper.find(Normaltekst);
    expect(normaltekst).to.have.length(4);
    expect(normaltekst.children().at(0).text()).is.eql('Grunn 1');
    expect(normaltekst.children().at(1).text()).is.eql('Grunn 2');
    expect(normaltekst.children().at(2).text()).is.eql('Grunn 3');
    expect(normaltekst.children().at(3).text()).is.eql('Grunn 4');
  });
});
