import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';

import opplysningAdresseType from 'kodeverk/opplysningAdresseType';
import relatertYtelseType from 'kodeverk/relatertYtelseType';
import opplysningsKilde from 'kodeverk/opplysningsKilde';
import navBrukerKjonn from 'kodeverk/navBrukerKjonn';
import soknadType from 'kodeverk/soknadType';
import AksjonspunktHelpText from 'sharedComponents/AksjonspunktHelpText';
import OmsorgOgForeldreansvarFaktaForm from './OmsorgOgForeldreansvarFaktaForm';

describe('<OmsorgOgForeldreansvarFaktaForm>', () => {
  it('skal vise hjelpetekster', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarFaktaForm.WrappedComponent
      intl={intlMock}
      readOnly={false}
      vilkarTypes={[]}
      erAksjonspunktForeldreansvar={false}
      hasOpenAksjonspunkter
      antallBarn={1}
      farSokerType="test"
      ytelser={[]}
      vilkarType="test"
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const helpText = wrapper.find(AksjonspunktHelpText);
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(2);
    expect(helpText.childAt(0).props().id).is.eql('OmsorgOgForeldreansvarFaktaForm.CheckInformation');
    expect(helpText.childAt(1).props().id).is.eql('OmsorgOgForeldreansvarFaktaForm.ChooseVilkar');
  });

  it('skal vise vilkår i select', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarFaktaForm.WrappedComponent
      intl={intlMock}
      readOnly={false}
      vilkarTypes={[{ kode: 'kode1', navn: 'navn1' }]}
      erAksjonspunktForeldreansvar={false}
      hasOpenAksjonspunkter
      antallBarn={1}
      farSokerType="test"
      ytelser={[]}
      vilkarType="test"
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const select = wrapper.find('SelectField');
    expect(select).has.length(1);
    expect(select.prop('selectValues')).has.length(1);
    expect(select.prop('selectValues')[0].props.value).to.eql('kode1');
    expect(select.prop('selectValues')[0].props.children).to.eql('navn1');
  });

  it('skal ikke vise vilkår i select ved readonly', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarFaktaForm.WrappedComponent
      intl={intlMock}
      readOnly
      vilkarTypes={[{ kode: 'kode1', navn: 'navn1' }]}
      erAksjonspunktForeldreansvar={false}
      hasOpenAksjonspunkter
      antallBarn={1}
      farSokerType="test"
      ytelser={[]}
      vilkarType="kode1"
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const select = wrapper.find('SelectField');
    expect(select).has.length(0);
    const element = wrapper.find('Element');
    expect(element).has.length(1);
    expect(element.childAt(0).text()).is.eql('navn1');
  });

  it('skal vise riktig hjelpetekster for foreldreansvar', () => {
    const wrapper = shallowWithIntl(<OmsorgOgForeldreansvarFaktaForm.WrappedComponent
      intl={intlMock}
      readOnly={false}
      vilkarTypes={[]}
      erAksjonspunktForeldreansvar
      hasOpenAksjonspunkter
      antallBarn={1}
      farSokerType="test"
      ytelser={[]}
      vilkarType="test"
      relatertYtelseTypes={[relatertYtelseType]}
    />);

    const helpText = wrapper.find('AksjonspunktHelpText');
    expect(helpText).has.length(1);
    expect(helpText.children()).has.length(1);
    expect(helpText.childAt(0).props().id).is.eql('OmsorgOgForeldreansvarFaktaForm.CheckInformationForeldreansvar');
  });

  it('skal gi feilmelding når antall barn er mindre enn 1', () => {
    const model = {
      originalAntallBarn: 1,
      antallBarn: 0,
    };

    const result = OmsorgOgForeldreansvarFaktaForm.validate(model);
    expect(result).is.eql({
      antallBarn: [{
        id: 'OmsorgOgForeldreansvarFaktaForm.AntallBarnValidation',
      }],
    });
  });

  it('skal gi feilmelding når antall barn er større enn originalt antall barn', () => {
    const model = {
      originalAntallBarn: 2,
      antallBarn: 3,
    };

    const result = OmsorgOgForeldreansvarFaktaForm.validate(model);
    expect(result).is.eql({
      antallBarn: [{
        id: 'OmsorgOgForeldreansvarFaktaForm.AntallBarnValidation',
      }],
    });
  });

  it('skal gi feilmelding når antall barn ikke er et gyldig tall', () => {
    const model = {
      originalAntallBarn: 2,
      antallBarn: 'test',
    };

    const result = OmsorgOgForeldreansvarFaktaForm.validate(model);
    expect(result).is.eql({
      antallBarn: [{
        id: 'ValidationMessage.InvalidNumber',
      }, {
        text: 'test',
      }],
    });
  });

  it('skal ikke gi feilmelding når antall barn og originalt antall er likt', () => {
    const model = {
      originalAntallBarn: 2,
      antallBarn: 2,
    };

    const result = OmsorgOgForeldreansvarFaktaForm.validate(model);
    expect(result).is.eql({});
  });

  it('skal sette opp initielle verdier når en ikke har avklarte data', () => {
    const soknad = {
      omsorgsovertakelseDato: '10-10-2017',
      farSokerType: {
        navn: 'test',
      },
      antallBarn: 2,
      fodselsdatoer: {
        1: '10-10-2017',
        2: '10-10-2017',
      },
      soknadType: {
        kode: soknadType.FODSEL,
      },
    };
    const familiehendelse = {};
    const personopplysning = {
      aktoerId: '1',
      navn: 'Petra Tester',
      dodsdato: undefined,
      adresser: [{
        adresselinje1: 'Vei 1',
        postNummer: '1000',
        poststed: 'Oslo',
        adresseType: {
          kode: opplysningAdresseType.POSTADRESSE,
          navn: 'Bostedsadresse',
        },
      }],
      opplysningsKilde: {
        kode: opplysningsKilde.SAKSBEHANDLER,
        navn: 'test',
      },
      navBrukerKjonn: {
        kode: navBrukerKjonn.KVINNE,
        navn: 'Kvinne',
      },
      personstatus: {
        kode: 'DØD',
        navn: 'DØD,',
      },
    };

    const initialValues = OmsorgOgForeldreansvarFaktaForm.buildInitialValues(soknad, familiehendelse, personopplysning);
    expect(initialValues).is.eql({
      omsorgsovertakelseDato: '10-10-2017',
      foreldreansvarDato: undefined,
      barn: [{
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
        fodselsdato: '10-10-2017',
        nummer: 2,
      }, {
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
        fodselsdato: '10-10-2017',
        nummer: 1,
      }],
      foreldre: [{
        dodsdato: undefined,
        originalDodsdato: undefined,
        erMor: true,
        erDod: true,
        adresse: 'Vei 1, 1000 Oslo',
        navn: 'Petra Tester',
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
        aktorId: '1',
      }],
      ytelser: undefined,
      antallBarn: 2,
      vilkarType: '',
      farSokerType: 'test',
      originalAntallBarn: 2,
    });
  });


  it('skal sette opp barn som en kombinasjon av bekreftet data fra TPS og data fra søknad', () => {
    const soknad = {
      omsorgsovertakelseDato: '10-10-2017',
      farSokerType: {
        navn: 'test',
      },
      antallBarn: 2,
      soknadType: {
        kode: soknadType.FODSEL,
      },
      fodselsdatoer: {
        1: '10-10-2017',
        3: '10-10-2017',
      },
    };
    const familiehendelse = {};
    const personopplysning = {
      aktoerId: '1',
      navn: 'Petra Tester',
      dodsdato: undefined,
      navBrukerKjonn: {
        kode: navBrukerKjonn.KVINNE,
        navn: 'Kvinne',
      },
      opplysningsKilde: {
        kode: opplysningsKilde.SAKSBEHANDLER,
        navn: 'test',
      },
      personstatus: {
        kode: 'DØD',
        navn: 'DØD,',
      },
      barnSoktFor: [{
        aktoerId: '1',
        nummer: 1,
        navn: 'Barn nr 1',
        fodselsdato: '10-10-2017',
        opplysningsKilde: {
          kode: opplysningsKilde.TPS,
        },
      }, {
        aktoerId: '2',
        nummer: 2,
        navn: 'Barn nr 2',
        fodselsdato: '05-05-2011',
        opplysningsKilde: {
          kode: opplysningsKilde.TPS,
        },
      }],
    };

    const initialValues = OmsorgOgForeldreansvarFaktaForm.buildInitialValues(soknad, familiehendelse, personopplysning);

    expect(initialValues).is.eql({
      omsorgsovertakelseDato: '10-10-2017',
      foreldreansvarDato: undefined,
      barn: [{
        aktorId: '1',
        opplysningsKilde: opplysningsKilde.TPS,
        fodselsdato: '10-10-2017',
        navn: 'Barn nr 1',
        nummer: 1,
      }, {
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
        fodselsdato: '10-10-2017',
        nummer: 3,
      }],
      foreldre: [{
        dodsdato: undefined,
        originalDodsdato: undefined,
        erMor: true,
        erDod: true,
        adresse: undefined,
        navn: 'Petra Tester',
        opplysningsKilde: opplysningsKilde.SAKSBEHANDLER,
        aktorId: '1',
      }],
      ytelser: undefined,
      antallBarn: 2,
      vilkarType: '',
      farSokerType: 'test',
      originalAntallBarn: 2,
    });
  });
});
