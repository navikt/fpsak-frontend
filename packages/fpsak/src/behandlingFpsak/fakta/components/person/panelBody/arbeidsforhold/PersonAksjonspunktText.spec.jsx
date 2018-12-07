import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import { FormattedMessage } from 'react-intl';

import PersonAksjonspunktText from './PersonAksjonspunktText';

describe('<PersonAksjonspunktText>', () => {
  const arbeidsforholdTemplate = {
    id: '1',
    navn: 'Test',
    arbeidsgiverIdentifikator: '123423',
    arbeidsgiverIdentifiktorGUI: '123423',
    fomDato: '2018-10-10',
    tilVurdering: true,
  };

  it('skal ikke vise hjelpetekst når en ikke har arbeidsforhold', () => {
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={undefined}
    />);
    expect(wrapper.html()).is.null;
  });

  it('skal ikke vise hjelpetekst når arbeidsforholdet ikke skal vurderes', () => {
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        tilVurdering: false,
      }}
    />);
    expect(wrapper.html()).is.null;
  });

  it('skal vise hjelpetekst når det ikke er mottatt inntekstmelding for arbeidsforholdet', () => {
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: undefined,
      }}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.eql('PersonAksjonspunktText.AvklarManglendeInntektsmelding');
  });

  it('skal vise hjelpetekst når en kan erstatte gamle arbeidsforhold eller markere arbeidsforholdet som nytt', () => {
    // Dette er arbeidsforhold med samme orgnr og arbeidsforholdId som det som blir editert.
    const gamleArbeidsforhold = [{ id: 2 }];

    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: gamleArbeidsforhold,
      }}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.eql('PersonAksjonspunktText.AvklarErstatteTidligere');
  });

  it('skal vise hjelpetekst når flagget harErstattetEttEllerFlere er satt', () => {
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: [],
        harErstattetEttEllerFlere: true,
      }}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.eql('PersonAksjonspunktText.AvklarErstatteAlle');
  });

  it('skal vise hjelpetekst når flagget ikkeRegistrertIAaRegister er satt', () => {
    const gamleArbeidsforhold = [{}];
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: { gamleArbeidsforhold },
        harErstattetEttEllerFlere: false,
        ikkeRegistrertIAaRegister: true,
      }}
    />);
    expect(wrapper.find(FormattedMessage).prop('id')).is.eql('PersonAksjonspunktText.AvklarIkkeRegistrertIAa');
  });

  it('skal ikke vise hjelpetekst når inntektsmelding er mottatt og det ikke er gamle arbeidsforhold og flagg ikke er satt', () => {
    const gamleArbeidsforhold = [{}];
    const wrapper = shallow(<PersonAksjonspunktText
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: { gamleArbeidsforhold },
        harErstattetEttEllerFlere: false,
        ikkeRegistrertIAaRegister: false,
      }}
    />);
    expect(wrapper.html()).is.null;
  });
});
