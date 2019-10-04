import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

import { PersonAksjonspunktTextImpl } from './PersonAksjonspunktText';

describe('<PersonAksjonspunktText>', () => {
  const arbeidsforholdTemplate = {
    id: '1',
    navn: 'Test',
    kilde: {
      navn: 'Aa-reg',
    },
    arbeidsgiverIdentifikator: '123423',
    arbeidsgiverIdentifiktorGUI: '123423',
    fomDato: '2018-10-10',
    tilVurdering: true,
    lagtTilAvSaksbehandler: false,
    permisjoner: [],
  };

  const fnGetKodeverknavn = () => 'navn';

  it('skal ikke vise hjelpetekst når en ikke har arbeidsforhold', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={undefined}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    expect(wrapper.find('FormattedHTMLMessage')).to.have.length(0);
  });

  it('skal ikke vise hjelpetekst når arbeidsforholdet ikke skal vurderes', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        tilVurdering: false,
      }}
      getKodeverknavn={() => ''}
    />);
    expect(wrapper.find('FormattedHTMLMessage')).to.have.length(0);
  });

  it('skal vise hjelpetekst når det ikke er mottatt inntekstmelding for arbeidsforholdet', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: undefined,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.AvklarManglendeInntektsmelding');
  });

  it('skal vise hjelpetekst når en kan erstatte gamle arbeidsforhold eller markere arbeidsforholdet som nytt', () => {
    // Dette er arbeidsforhold med samme orgnr og arbeidsforholdId som det som blir editert.
    const gamleArbeidsforhold = [{ id: 2 }];

    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: gamleArbeidsforhold,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.AvklarErstatteTidligere');
  });

  it('skal vise hjelpetekst når flagget harErstattetEttEllerFlere er satt', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: [],
        harErstattetEttEllerFlere: true,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.AvklarErstatteAlle');
  });

  it('skal vise hjelpetekst når flagget ikkeRegistrertIAaRegister er satt', () => {
    const gamleArbeidsforhold = [{}];
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: { gamleArbeidsforhold },
        harErstattetEttEllerFlere: false,
        ikkeRegistrertIAaRegister: true,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.AvklarIkkeRegistrertIAa');
  });

  it('skal ikke vise hjelpetekst når inntektsmelding er mottatt og det ikke er gamle arbeidsforhold og flagg ikke er satt', () => {
    const gamleArbeidsforhold = [{}];
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: { gamleArbeidsforhold },
        harErstattetEttEllerFlere: false,
        ikkeRegistrertIAaRegister: false,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component).to.be.empty;
  });

  it('skal vise hjelpetekst for å legge til arbeidsforhold', () => {
    const gamleArbeidsforhold = [{}];
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        lagtTilAvSaksbehandler: true,
        mottattDatoInntektsmelding: '2018-01-01',
        replaceOptions: { gamleArbeidsforhold },
        harErstattetEttEllerFlere: false,
        ikkeRegistrertIAaRegister: true,
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.LeggTilArbeidsforhold');
  });

  it('skal vise hjelpetekst for arbeidsforhold med en permisjon og ikke mottat IM', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: undefined,
        permisjoner: [
          {
            permisjonFom: '2018-10-01',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.SokerHarPermisjonOgIkkeMottattIM');
    expect(component.props().values.permisjonFom).to.eql('01.10.2018');
    expect(component.props().values.permisjonTom).to.eql('');
  });

  it('skal vise hjelpetekst for arbeidsforhold med en permisjon og mottat IM', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2019-01-01',
        permisjoner: [
          {
            permisjonFom: '2018-10-01',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.SokerHarPermisjonOgMottattIM');
    expect(component.props().values.permisjonFom).to.eql('01.10.2018');
    expect(component.props().values.permisjonTom).to.eql('');
  });

  it('skal vise hjelpetekst for arbeidsforhold med flere permisjoner', () => {
    const wrapper = shallow(<PersonAksjonspunktTextImpl
      arbeidsforhold={{
        ...arbeidsforholdTemplate,
        mottattDatoInntektsmelding: '2019-01-01',
        permisjoner: [
          {
            permisjonFom: '2015-01-01',
            permisjonTom: '2016-01-01',
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
          {
            permisjonFom: '2018-10-10',
            permisjonTom: undefined,
            permisjonsprosent: 100,
            permisjonsÅrsak: 'aarsak',
          },
        ],
      }}
      getKodeverknavn={fnGetKodeverknavn}
    />);
    const component = wrapper.find('FormattedHTMLMessage');
    expect(component.props().id).to.eql('PersonAksjonspunktText.SokerHarFlerePermisjoner');
    expect(component.props().values).to.empty;
  });
});
