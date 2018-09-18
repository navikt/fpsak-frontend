import React from 'react';
import { expect } from 'chai';
import { shallowWithIntl, intlMock } from 'testHelpers/intl-enzyme-test-helper';
import DokumentasjonFaktaForm from './DokumentasjonFaktaForm';

describe('<DokumentasjonFaktaForm>', () => {
  it('skal vise alle fodselsdatoer i datepickers', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15', 2: '2014-10-15' }}
      omsorgsovertakelseDato="2017-10-15"
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt={false}
    />);
    const datepickers = wrapper.find('DatepickerField');
    expect(datepickers).to.have.length(3);

    const omsorgsDatepicker = datepickers.first();
    expect(omsorgsDatepicker.prop('name')).to.eql('omsorgsovertakelseDato');

    const fodsel1Datepicker = datepickers.at(1);
    expect(fodsel1Datepicker.prop('name')).to.eql('fodselsdatoer.1');

    const fodsel2Datepicker = datepickers.last();
    expect(fodsel2Datepicker.prop('name')).to.eql('fodselsdatoer.2');

    const antallBarnUnder15Ar = wrapper.find('Normaltekst');
    expect(antallBarnUnder15Ar).to.have.length(1);
    expect(antallBarnUnder15Ar.childAt(0).text()).to.eql('2');
  });

  it('skal ikke vise verdi for antall_barn_som_fyller_vilkåret når omsorgsovertakelseDato er tom', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const antallBarnUnder15Ar = wrapper.find('Normaltekst');
    expect(antallBarnUnder15Ar).to.have.length(1);
    expect(antallBarnUnder15Ar.childAt(0).text()).to.eql('-');
  });

  it('skal ikke vise verdi for antall_barn_som_fyller_vilkåret når alle fødselsdatoer er tomme', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: null, 2: null }}
      omsorgsovertakelseDato="2016-10-15"
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const antallBarnUnder15Ar = wrapper.find('Normaltekst');
    expect(antallBarnUnder15Ar).to.have.length(1);
    expect(antallBarnUnder15Ar.childAt(0).text()).to.eql('-');
  });

  it('skal vise verdi for antall_barn_som_fyller_vilkåret når minst en fødselsdato ikke er tomme', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: null, 2: '2016-10-15' }}
      omsorgsovertakelseDato="2016-10-15"
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const antallBarnUnder15Ar = wrapper.find('Normaltekst');
    expect(antallBarnUnder15Ar).to.have.length(1);
    expect(antallBarnUnder15Ar.childAt(0).text()).to.eql('1');
  });

  it('skal sette opp initielle verdier fra søknad når det ikke finnes avklarte data', () => {
    const soknad = {
      omsorgsovertakelseDato: '2016-10-15',
      adopsjonFodelsedatoer: '2016-03-15',
    };

    const initialValues = DokumentasjonFaktaForm.buildInitialValues({}, soknad);

    expect(initialValues).to.eql({
      barnetsAnkomstTilNorgeDato: undefined,
      omsorgsovertakelseDato: '2016-10-15',
      fodselsdatoer: '2016-03-15',
    });
  });

  it('skal ikke vise datofelt for barnets ankomst til norge når engangsstønad', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const dateField = wrapper.find('[name="barnetsAnkomstTilNorgeDato"]');
    expect(dateField).to.have.length(0);
  });


  it('skal ikke vise datofelt for barnets ankomst til norge når foreldrepenger hvis ikke oppgitt i søknad', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const dateField = wrapper.find('[name="barnetsAnkomstTilNorgeDato"]');
    expect(dateField).to.have.length(0);
  });

  it('skal vise tekst stebarnsadopsjon når det er en foreldrepengersak og en har aksjonspunkt for ektefelles/samboers barn', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak
      hasEktefellesBarnAksjonspunkt
    />);

    const dateField = wrapper.find('[name="omsorgsovertakelseDato"]');
    expect(dateField.prop('label')).to.eql({ id: 'DokumentasjonFaktaForm.Stebarnsadopsjon' });
  });

  it('skal vise tekst omsorgsovertakelse når det ikke er en foreldrepengersak og en har aksjonspunkt for ektefelles/samboers barn', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak={false}
      hasEktefellesBarnAksjonspunkt
    />);

    const dateField = wrapper.find('[name="omsorgsovertakelseDato"]');
    expect(dateField.prop('label')).to.eql({ id: 'DokumentasjonFaktaForm.Omsorgsovertakelsesdato' });
  });

  it('skal vise tekst omsorgsovertakelse når det en foreldrepengersak og en ikke har aksjonspunkt for ektefelles/samboers barn', () => {
    const wrapper = shallowWithIntl(<DokumentasjonFaktaForm.WrappedComponent
      intl={intlMock}
      fodselsdatoer={{ 1: '2016-10-15' }}
      omsorgsovertakelseDato={null}
      readOnly={false}
      erForeldrepengerFagsak
      hasEktefellesBarnAksjonspunkt={false}
    />);

    const dateField = wrapper.find('[name="omsorgsovertakelseDato"]');
    expect(dateField.prop('label')).to.eql({ id: 'DokumentasjonFaktaForm.Omsorgsovertakelsesdato' });
  });

  it('skal sette opp initielle verdier fra avklarte data når dette finnes', () => {
    const soknad = {
      omsorgsovertakelseDato: '2016-10-15',
      adopsjonFodelsedatoer: '2016-03-15',
    };
    const familiehendelse = {
      omsorgsovertakelseDato: '2015-10-15',
      adopsjonFodelsedatoer: '2015-03-15',
    };

    const initialValues = DokumentasjonFaktaForm.buildInitialValues(soknad, familiehendelse);

    expect(initialValues).to.eql({
      barnetsAnkomstTilNorgeDato: undefined,
      omsorgsovertakelseDato: '2015-10-15',
      fodselsdatoer: '2015-03-15',
    });
  });
});
