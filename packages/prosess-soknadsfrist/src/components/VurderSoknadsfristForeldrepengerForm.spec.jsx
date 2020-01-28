import React from 'react';
import { expect } from 'chai';

import { intlMock } from '@fpsak-frontend/utils-test/src/intl-enzyme-test-helper';
import { reduxFormPropsMock } from '@fpsak-frontend/utils-test/src/redux-form-test-helper';

import { AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import { VurderSoknadsfristForeldrepengerFormImpl as UnwrappedForm } from './VurderSoknadsfristForeldrepengerForm';
import shallowWithIntl from '../../i18n/intl-enzyme-test-helper-prosess-soknadsfrist';

describe('<VurderSoknadsfristForeldrepengerForm>', () => {
  it('skal rendre form og vise søknadsfristdato som er lik mottatt dato minus antallDagerSoknadLevertForSent', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      readOnly={false}
      readOnlySubmitButton={false}
      mottattDato="2017-10-15"
      antallDagerSoknadLevertForSent={9}
      soknadsperiodeStart="2017-06-05"
      soknadsperiodeSlutt="2017-11-01"
      soknadsfristdato="2017-09-30"
      isApOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);

    const helpText = wrapper.find(AksjonspunktHelpTextTemp);
    expect(helpText.childAt(0).prop('id')).to.eql('VurderSoknadsfristForeldrepengerForm.AksjonspunktHelpText');
    expect(helpText.childAt(0).prop('values')).to.eql({ numberOfDays: 9, soknadsfristdato: '30.09.2017' });
  });

  it('skal rendre form og vise mottatt dato, periode og begrunnelse', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      mottattDato="2017-10-15"
      antallDagerSoknadLevertForSent={9}
      soknadsperiodeStart="2017-06-05"
      soknadsperiodeSlutt="2017-11-01"
      soknadsfristdato="2017-09-30"
      isApOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const normalTekst = wrapper.find('Normaltekst');
    expect(normalTekst).has.length(2);
    // Mottattdato
    expect(normalTekst.first().childAt(0).text()).to.eql('15.10.2017');

    // Periode
    expect(normalTekst.at(1).childAt(0).text()).to.eql('05.06.2017 - 01.11.2017');
  });

  it('skal rendre radiobuttons', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      gyldigSenFremsetting={false}
      mottattDato="2017-10-15"
      antallDagerSoknadLevertForSent={15}
      soknadsperiodeStart="2017-06-05"
      soknadsperiodeSlutt="2017-11-01"
      soknadsfristdato="2017-09-30"
      isApOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const radioGroup = wrapper.find('RadioGroupField');
    expect(radioGroup).has.length(1);
    expect(radioGroup.first().prop('name')).to.eql('gyldigSenFremsetting');
    const radioFieldsGroup = radioGroup.first().find('RadioOption');
    expect(radioFieldsGroup).to.have.length(2);
  });

  it('skal ikke vise datepicker når gyldigSenFremsetting er false', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      readOnly={false}
      readOnlySubmitButton={false}
      gyldigSenFremsetting={false}
      mottattDato="2017-10-15"
      antallDagerSoknadLevertForSent={15}
      soknadsperiodeStart="2017-06-05"
      soknadsperiodeSlutt="2017-11-01"
      soknadsfristdato="2017-09-30"
      isApOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const datepicker = wrapper.find('DatepickerField');
    expect(datepicker).has.length(0);
  });

  it('skal vise datepicker når gyldigSenFremsetting er true', () => {
    const wrapper = shallowWithIntl(<UnwrappedForm
      {...reduxFormPropsMock}
      intl={intlMock}
      gyldigSenFremsetting
      readOnly={false}
      readOnlySubmitButton={false}
      mottattDato="2017-10-15"
      antallDagerSoknadLevertForSent={15}
      soknadsperiodeStart="2017-06-05"
      soknadsperiodeSlutt="2017-11-01"
      soknadsfristdato="2017-09-30"
      isApOpen
      behandlingId={1}
      behandlingVersjon={1}
    />);
    const datepicker = wrapper.find('DatepickerField');
    expect(datepicker).has.length(1);
    expect(datepicker.prop('name')).to.eql('ansesMottatt');
  });
});
