import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl } from '@fpsak-frontend/assets/testHelpers/intl-enzyme-test-helper';

import TidsbegrensetArbeidsforholdForm from './TidsbegrensetArbeidsforholdForm';

const forhold = [
  {
    virksomhetNavn: 'arbeidsgiver 1',
    virksomhetId: '123456789',
    startdato: '2017-01-01',
    opphoersdato: '2017-02-02',
  },
  {
    virksomhetNavn: 'arbeidsgiver 2',
    virksomhetId: '987654321',
    startdato: '2017-02-02',
    opphoersdato: '2017-03-03',
  },
];

describe('<TidsbegrensetArbeidsforholdForm>', () => {
  it('skal teste at korrekt antall radioknapper vises', () => {
    const wrapper = shallowWithIntl(<TidsbegrensetArbeidsforholdForm.WrappedComponent
      readOnly={false}
      arbeidsforhold={forhold}
      isAksjonspunktClosed={false}
    />);
    const radios = wrapper.find('RadioOption');
    expect(radios).to.have.length(4);
  });
  it('skal teste at korrekte overskrifter vises', () => {
    const wrapper = shallowWithIntl(<TidsbegrensetArbeidsforholdForm.WrappedComponent
      readOnly={false}
      arbeidsforhold={forhold}
      isAksjonspunktClosed={false}
    />);
    const message = wrapper.find('FormattedMessage');
    expect(message).to.have.length(2);
    expect(message.first().prop('id')).to.equal('BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold');
    expect(message.first().prop('values').navn).to.equal('arbeidsgiver 1 (123456789)');
    expect(message.first().prop('values').fom).to.equal('01.01.2017');
    expect(message.first().prop('values').tom).to.equal('02.02.2017');

    expect(message.last().prop('id')).to.equal('BeregningInfoPanel.TidsbegrensetArbFor.Arbeidsforhold');
    expect(message.last().prop('values').navn).to.equal('arbeidsgiver 2 (987654321)');
    expect(message.last().prop('values').fom).to.equal('02.02.2017');
    expect(message.last().prop('values').tom).to.equal('03.03.2017');
  });
});
